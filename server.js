const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const crypto = require('crypto');
const path = require('path');
const { createOwnerAuth } = require('./owner-auth');
const rules = require('./game-rules');
const { createThefts } = require('./thefts');

function createGameServer({ adminToken = process.env.ADMIN_TOKEN || '', ownerKey = process.env.OWNER_ACCESS_KEY || '' } = {}) {
  const app = express();
  app.get('/healthz', (_req, res) => res.json({ ok: true, protocol: 2 }));
  for (const file of ['index.html', 'network.js', 'config.js', 'game-rules.js']) {
    app.get(file === 'index.html' ? ['/', '/index.html'] : '/' + file,
      (_req, res) => res.sendFile(path.join(__dirname, file)));
  }
  app.get('/owner', (_req, res) => res.set('Cache-Control', 'no-store').sendFile(path.join(__dirname, 'owner.html')));
  app.use('/vendor', express.static(path.join(__dirname, 'vendor')));
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 16000 });
  const clients = new Map();
  const ownerAuth = createOwnerAuth({ adminToken, ownerKey });
  ownerAuth.routes(app, clients);
  const MAX = 8;
  const send = (ws, data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
  };
  const members = room => [...clients.values()].filter(c => c.room === room);
  const counts = () => {
    const result = {};
    for (const c of clients.values()) if (c.room) result[c.room.slice(3)] = (result[c.room.slice(3)] || 0) + 1;
    return result;
  };
  function lobbies() {
    const data = { type: 'lobbies', counts: counts() };
    for (const c of clients.values()) send(c.ws, data);
  }
  function roster(room) {
    if (!room) return;
    const list = members(room);
    for (const c of list) send(c.ws, { type: 'peers', room, peers: list.map(p => ({
      peer: p.id, baseSlot: p.baseSlot, kind: 'viewer', presence: p.presence, isMe: p === c
    })) });
  }
  const thefts = createThefts({ members, roster, event: (c, event, data) => send(c.ws, { type: 'event', room: c.room, event, peer: 'server', isMe: false, data }) });
  wss.on('connection', (ws, req) => {
    const ownerSession = ownerAuth.sameOrigin(req) ? ownerAuth.read(req) : null;
    const c = { ws, id: crypto.randomUUID(), room: null, baseSlot: null, presence: {}, admin: !!ownerSession, ownerSession, alive: true };
    clients.set(ws, c);
    send(ws, { type: 'hello', peer: c.id, protocol: 2, admin: c.admin });
    send(ws, { type: 'lobbies', counts: counts() });
    ws.on('pong', () => { c.alive = true; });
    ws.on('message', raw => {
      let m; try { m = JSON.parse(raw); } catch { return; }
      if (!m || typeof m !== 'object' || Array.isArray(m)) return;
      if (m.type === 'auth') {
        c.admin = ownerAuth.matches(m.token);
        send(ws, { type: 'auth', ok: c.admin });
      } else if (m.type === 'join') {
        if (typeof m.room !== 'string' || !/^hb-[a-z0-9]{3,12}$/.test(m.room))
          return send(ws, { type: 'join', room: m.room, ok: false, error: 'Invalid lobby' });
        if (c.room !== m.room && members(m.room).length >= MAX)
          return send(ws, { type: 'join', room: m.room, ok: false, error: 'Lobby full' });
        const old = c.room;
        if (old !== m.room) {
          thefts.release(c);
          const occupied = new Set(members(m.room).map(x => x.baseSlot));
          c.baseSlot = rules.bases.findIndex((_base, index) => !occupied.has(index));
          c.presence = {}; c.inventoryPatches = new Map();
        }
        c.room = m.room;
        send(ws, { type: 'join', room: c.room, ok: true, baseSlot: c.baseSlot });
        if (old !== c.room) roster(old);
        roster(c.room); lobbies();
      } else if (m.type === 'leave') {
        const old = c.room; thefts.release(c); c.room = null; c.baseSlot = null; c.presence = {}; c.inventoryPatches = new Map();
        roster(old); lobbies();
      } else if (m.type === 'presence') {
        if (!c.room || !m.data || typeof m.data !== 'object' || Array.isArray(m.data)) return;
        const d = m.data, safe = {};
        if (typeof d.nm === 'string') safe.nm = d.nm.slice(0, 20);
        if (Array.isArray(d.s)) safe.s = d.s.slice(0, 16).map(x => Number.isInteger(x) && x >= -1 && x < 1000 ? x : -1);
        for (const k of ['px', 'pz', 'py', 'cash', 'cb'])
          if (Number.isFinite(d[k])) safe[k] = Math.max(-1000000, Math.min(1000000, d[k]));
        if (typeof d.lk === 'boolean') safe.lk = d.lk;
        if (d.f2 === 0 || d.f2 === 1 || typeof d.f2 === 'boolean') safe.f2 = d.f2 ? 1 : 0;
        if (Number.isInteger(d.bat)) safe.bat = Math.max(0, Math.min(4, d.bat));
        thefts.applyPresence(c, safe);
        c.presence = { ...c.presence, ...safe };
        roster(c.room);
      } else if (m.type === 'emit') {
        if (!c.room || !['steal', 'bank', 'hit', 'evt', 'trade'].includes(m.event) ||
          !m.data || typeof m.data !== 'object' || Array.isArray(m.data)) return;
        if (c.ownerSession && c.ownerSession.expires <= Date.now()) { c.admin = false; c.ownerSession = null; send(ws, { type: 'auth', ok: false }); }
        if (m.event === 'evt' && !c.admin) return;
        if (m.data.to !== undefined && m.data.to !== null && typeof m.data.to !== 'string') return;
        if (m.event === 'steal') { thefts.steal(c, m.data); return; }
        if (m.event === 'bank') { thefts.bank(c, m.data); return; }
        if (m.event === 'hit') {
          const time = Date.now();
          if (time - (c.lastHit || 0) < 550) return;
          c.lastHit = time;
          if (m.data.to) {
            const target = members(c.room).find(x => x.id === m.data.to);
            if (!target || target === c || !rules.near(c.presence, { x: target.presence.px, z: target.presence.pz, y: target.presence.py || 0 }, 4.55 + (c.presence.bat || 0) * .5)) return;
            thefts.hit(target);
          }
        }
        for (const other of members(c.room)) {
          if (m.data.to && other.id !== m.data.to) continue;
          send(other.ws, { type: 'event', room: c.room, event: m.event,
            peer: c.id, data: m.data, isMe: other === c });
        }
      }
    });
    ws.on('close', () => { const old = c.room; thefts.release(c); clients.delete(ws); roster(old); lobbies(); });
    ws.on('error', () => {});
  });
  const heartbeat = setInterval(() => {
    for (const c of clients.values()) {
      if (!c.alive) { c.ws.terminate(); continue; }
      c.alive = false; c.ws.ping();
    }
  }, 30000);
  heartbeat.unref();
  wss.on('close', () => clearInterval(heartbeat));
  return { server, wss, clients };
}
module.exports = { createGameServer };
if (require.main === module) {
  const { server } = createGameServer();
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('Brainrot Heist running on port ' + server.address().port));
}
