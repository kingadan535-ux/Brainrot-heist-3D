/* Adapter for the original game's room API and the Render /ws protocol. */
(() => {
  let ws, peer = null, admin = false, ready = false, retry = 0, retryTimer;
  let current = null, readyWaiters = [], pendingJoin = null, pendingAuth = null;
  const listeners = new Map();
  const rooms = new Map();
  let lobbySnapshot = { peers: [] };
  const fire = (key, data) => {
    for (const fn of listeners.get(key) || []) {
      try { fn(data); } catch (error) { console.error(error); }
    }
  };
  const on = (key, fn) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn);
    return () => listeners.get(key)?.delete(fn);
  };
  function status(state, message = '') {
    window.dispatchEvent(new CustomEvent('brainrot:connection', { detail: { state, message } }));
  }
  function endpoint() {
    const url = new URL(window.BRAINROT_SERVER_URL || '/ws', location.href);
    if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol)) throw Error('Invalid server URL');
    url.protocol = url.protocol === 'https:' || url.protocol === 'wss:' ? 'wss:' : 'ws:';
    if (location.protocol === 'https:' && url.protocol !== 'wss:') throw Error('Online play requires a secure server URL');
    if (url.pathname === '/') url.pathname = '/ws';
    url.hash = '';
    return url.href;
  }
  function send(data) {
    if (!ready || ws?.readyState !== 1) throw Error('Multiplayer is reconnecting');
    ws.send(JSON.stringify(data));
  }
  function waitReady() {
    if (ready) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject };
      waiter.timer = setTimeout(() => {
        readyWaiters = readyWaiters.filter(x => x !== waiter);
        reject(Error('Server is still waking up. Reconnection will continue.'));
      }, 70000);
      readyWaiters.push(waiter);
    });
  }
  function makeRoom(code) {
    const r = {
      code, peers: [], data: {},
      onPeers(fn) { const off = on(code + ':peers', fn); fn({ peers: r.peers }); return off; },
      on: (event, fn) => on(code + ':' + event, fn),
      async presence(data) {
        if (current !== r) return;
        r.data = { ...r.data, ...data };
        if (ready && !pendingJoin) send({ type: 'presence', data });
      },
      async emit(event, data) {
        if (current !== r || pendingJoin) throw Error('Lobby unavailable');
        send({ type: 'emit', event, data });
      },
      async leave() {
        if (current === r) {
          if (ready) send({ type: 'leave' });
          current = null;
        }
        rooms.delete(code);
      }
    };
    return r;
  }
  async function join(code, restoring = false) {
    if (!/^hb-[a-z0-9]{3,12}$/.test(code)) throw Error('Invalid lobby');
    await waitReady();
    if (pendingJoin) throw Error('Already joining a lobby');
    if (!restoring && current?.code === code) return current;
    const r = rooms.get(code) || makeRoom(code);
    rooms.set(code, r); // Register before sending: a roster can follow the acknowledgement immediately.
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pendingJoin?.room === r) {
          pendingJoin = null;
          reject(Error('Lobby join timed out'));
          ws?.close(); // Reconnect to remove ambiguous server membership.
        }
      }, 10000);
      pendingJoin = { room: r, resolve, reject, timer };
      send({ type: 'join', room: code });
    });
  }
  function connect() {
    clearTimeout(retryTimer);
    status(retry ? 'reconnecting' : 'connecting');
    try { ws = new WebSocket(endpoint()); }
    catch (error) { status('offline', error.message); schedule(); return; }
    const socket = ws;
    const timeout = setTimeout(() => socket.close(), 65000);
    socket.onmessage = event => {
      if (socket !== ws) return;
      let m; try { m = JSON.parse(event.data); } catch { return; }
      if (!m || typeof m !== 'object') return;
      if (m.type === 'hello') {
        clearTimeout(timeout);
        peer = m.peer; ready = true; retry = 0;
        admin = m.admin === true;
        window.dispatchEvent(new CustomEvent('brainrot:auth', { detail: admin }));
        const previous = current;
        for (const waiter of readyWaiters.splice(0)) { clearTimeout(waiter.timer); waiter.resolve(); }
        if (previous) join(previous.code, true).catch(error => {
          current = null;
          status('connected', error.message);
        });
        else status('connected');
      } else if (m.type === 'join' && pendingJoin?.room.code === m.room) {
        const pending = pendingJoin; pendingJoin = null; clearTimeout(pending.timer);
        if (m.ok) {
          current = pending.room;
          send({ type: 'presence', data: current.data });
          pending.resolve(current);
          status('online');
        } else pending.reject(Error(m.error || 'Could not join lobby'));
      } else if (m.type === 'peers' && Array.isArray(m.peers)) {
        const r = rooms.get(m.room);
        if (r) { r.peers = m.peers; fire(m.room + ':peers', { peers: r.peers }); }
      } else if (m.type === 'lobbies' && m.counts && typeof m.counts === 'object') {
        lobbySnapshot = { peers: Object.entries(m.counts).flatMap(([lb, n]) =>
          Array.from({ length: Math.max(0, Math.min(8, Number(n) || 0)) }, (_, i) =>
            ({ peer: lb + '-' + i, kind: 'viewer', presence: { lb } }))) };
        fire('lobbies', lobbySnapshot);
      } else if (m.type === 'event') fire(m.room + ':' + m.event, m);
      else if (m.type === 'auth') {
        admin = m.ok === true;
        window.dispatchEvent(new CustomEvent('brainrot:auth', { detail: admin }));
        if (pendingAuth) { clearTimeout(pendingAuth.timer); pendingAuth.resolve(admin); pendingAuth = null; }
      }
    };
    socket.onerror = () => {}; // close drives a single retry and rejects pending operations.
    socket.onclose = () => {
      clearTimeout(timeout);
      if (socket !== ws) return;
      ready = false; peer = null; admin = false;
      window.dispatchEvent(new CustomEvent('brainrot:auth', { detail: false }));
      if (pendingJoin) {
        clearTimeout(pendingJoin.timer); pendingJoin.reject(Error('Connection interrupted')); pendingJoin = null;
      }
      if (pendingAuth) {
        clearTimeout(pendingAuth.timer); pendingAuth.reject(Error('Connection interrupted')); pendingAuth = null;
      }
      for (const r of rooms.values()) { r.peers = []; fire(r.code + ':peers', { peers: [] }); }
      window.dispatchEvent(new CustomEvent('brainrot:disconnect'));
      status('reconnecting');
      schedule();
    };
  }
  function schedule() {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(connect, Math.min(15000, 1000 * 2 ** Math.min(retry++, 4)));
  }
  const hub = {
    onPeers(fn) { const off = on('lobbies', fn); fn(lobbySnapshot); return off; },
    async presence() {}, // Lobby membership comes from server joins, not client claims.
    join
  };
  window.claude = { use: async kind => {
    if (kind === 'room') return hub;
    if (kind === 'user') return { isOwner: () => admin, canEdit: () => admin };
    throw Error('Unknown service');
  } };
  window.brainrotAdminLogin = async token => {
    await waitReady();
    if (pendingAuth) throw Error('Login already pending');
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pendingAuth = null; reject(Error('Login timed out')); }, 10000);
      pendingAuth = { resolve, reject, timer };
      send({ type: 'auth', token });
    });
  };
  window.brainrotConnection = () => ready;
  window.brainrotPeer = () => peer;
  connect();
})();
