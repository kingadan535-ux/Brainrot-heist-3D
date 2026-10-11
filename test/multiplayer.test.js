const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { WebSocket } = require('ws');
const { createGameServer } = require('../server');
const delay = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, timeout = 5000) {
  const start = Date.now();
  while (!fn()) { if (Date.now() - start > timeout) throw Error('Condition timed out'); await delay(10); }
}
async function setup(t) {
  const game = createGameServer({ adminToken: 'test-admin-only' });
  await new Promise(r => game.server.listen(0, '127.0.0.1', r));
  const origin = 'http://127.0.0.1:' + game.server.address().port;
  const cleanups = [];
  t.after(async () => {
    for (const cleanup of cleanups) cleanup();
    for (const c of game.clients.values()) c.ws.terminate();
    await new Promise(r => game.wss.close(r));
    await new Promise(r => game.server.close(r));
  });
  return { game, origin, cleanups };
}
async function client(env, configured = env.origin, page = 'https://custom-game.example/') {
  const events = [], sockets = [], timers = new Set();
  class Socket extends WebSocket { constructor(url) { super(url); sockets.push(this); } }
  const window = new EventTarget();
  window.BRAINROT_SERVER_URL = configured;
  window.addEventListener('brainrot:connection', e => events.push(e.detail.state));
  const sandbox = { window, location: new URL(page), URL, CustomEvent, WebSocket: Socket, console,
    setTimeout(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; },
    clearTimeout(id) { timers.delete(id); clearTimeout(id); } };
  // A cross-origin development connection uses HTTP on both sides.
  if (configured.startsWith('http:')) sandbox.location = new URL('http://static-game.example/');
  vm.runInNewContext(fs.readFileSync(require.resolve('../network.js'), 'utf8'), sandbox);
  env.cleanups.push(() => {
    for (const socket of sockets) { socket.onclose = null; socket.terminate(); }
    for (const timer of timers) clearTimeout(timer);
  });
  await until(() => window.brainrotConnection());
  return { window, events, sockets, hub: await window.claude.use('room') };
}
test('full uploaded game loads adapter before its inline script', () => {
  const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
  assert.ok(html.indexOf('src="config.js"') < html.indexOf('src="network.js"'));
  assert.ok(html.indexOf('src="network.js"') < html.indexOf('<script>'));
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  for (const feature of ['function carryTick', 'function buyF2', 'function onTrade', 'function conHtml']) assert.ok(html.includes(feature));
});
test('two clients: roster, 16 slots, elevation, trade, isolation, admin authorization', async t => {
  const env = await setup(t), a = await client(env), b = await client(env);
  const ra = await a.hub.join('hb-main'), rb = await b.hub.join('hb-main');
  await ra.presence({ nm: 'Alice', s: Array.from({ length: 16 }, (_, i) => i), f2: 1, py: 12, px: 4 });
  await rb.presence({ nm: 'Bob' });
  await until(() => rb.peers.some(p => p.presence.nm === 'Alice' && p.presence.py === 12));
  const alice = rb.peers.find(p => p.presence.nm === 'Alice');
  assert.equal(alice.presence.s.length, 16); assert.equal(alice.presence.f2, 1);
  assert.equal(rb.peers.filter(p => p.isMe).length, 1);
  const bob = ra.peers.find(p => p.presence.nm === 'Bob');
  const trade = []; rb.on('trade', m => trade.push(m));
  await ra.emit('trade', { k: 'offer', to: bob.peer, id: 'test', give: 2, want: 3 });
  await until(() => trade.length === 1);
  assert.equal(trade[0].peer, alice.peer); assert.equal(trade[0].isMe, false);
  const admin = []; rb.on('evt', m => admin.push(m));
  await ra.emit('evt', { k: 'cash', v: 10000 }); await delay(50); assert.equal(admin.length, 0);
  assert.equal(await a.window.brainrotAdminLogin('wrong'), false);
  assert.equal(await a.window.brainrotAdminLogin('test-admin-only'), true);
  await ra.emit('evt', { k: 'cash', v: 10000 }); await until(() => admin.length === 1);
  const previous = ra; const other = await a.hub.join('hb-other'); await previous.leave();
  await other.presence({ nm: 'Alice' }); await until(() => rb.peers.length === 1);
  await other.emit('trade', { k: 'offer', to: bob.peer }); await delay(50); assert.equal(trade.length, 1);
  assert.equal((await fetch(env.origin + '/server.js')).status, 404);
  assert.deepEqual(await (await fetch(env.origin + '/healthz')).json(), { ok: true, protocol: 2 });
});
test('disconnect clears roster and automatically rejoins with a new peer and restored presence', async t => {
  const env = await setup(t), a = await client(env), b = await client(env);
  const ra = await a.hub.join('hb-retry'), rb = await b.hub.join('hb-retry');
  await ra.presence({ nm: 'Alice', s: [4], py: 8 });
  await until(() => rb.peers.some(p => p.presence.nm === 'Alice'));
  const before = a.window.brainrotPeer();
  [...env.game.clients.values()].find(c => c.id === before).ws.terminate();
  await until(() => a.events.includes('reconnecting'));
  assert.equal(ra.peers.length, 0);
  await until(() => a.window.brainrotPeer() && a.window.brainrotPeer() !== before);
  await until(() => rb.peers.some(p => p.presence.nm === 'Alice' && p.peer !== before));
  assert.equal(rb.peers.find(p => p.presence.nm === 'Alice').presence.py, 8);
  assert.equal(a.events.at(-1), 'online');
});
test('8-player limit, invalid code, initial lobby counts, and same-origin URL', async t => {
  const env = await setup(t), clients = [];
  for (let i = 0; i < 8; i++) { const c = await client(env); await c.hub.join('hb-full'); clients.push(c); }
  const last = await client(env);
  let snapshot; last.hub.onPeers(value => { snapshot = value; });
  await until(() => snapshot.peers.length === 8);
  await assert.rejects(last.hub.join('hb-full'), /Lobby full/);
  await assert.rejects(last.hub.join('bad!'), /Invalid lobby/);
  const own = await client(env, '', env.origin + '/');
  assert.equal(own.sockets[0].url, env.origin.replace('http:', 'ws:') + '/ws');
  await own.hub.join('hb-other');
});
