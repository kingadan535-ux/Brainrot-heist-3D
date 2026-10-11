const crypto = require('node:crypto');
const COOKIE = 'brainrot_owner';
const MAX_AGE = 7 * 24 * 60 * 60;
const digest = value => crypto.createHash('sha256').update(value).digest();

function createOwnerAuth({ adminToken = '', ownerKey = '' } = {}) {
  const keys = [adminToken, ownerKey].filter(Boolean);
  const signingKey = keys.length ? digest('brainrot-owner-session:' + keys.join(':')) : null;
  const revoked = new Map();
  const attempts = new Map();
  const matches = token => typeof token === 'string' && token.length <= 256 && keys.some(key =>
    crypto.timingSafeEqual(digest(token), digest(key)));
  const signature = value => crypto.createHmac('sha256', signingKey).update(value).digest('base64url');
  function sameOrigin(req) {
    const protocol = req.headers['x-forwarded-proto']?.split(',')[0].trim() || (req.socket.encrypted ? 'https' : 'http');
    return req.headers.origin === protocol + '://' + req.headers.host;
  }
  function read(req) {
    if (!signingKey) return null;
    const raw = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
    if (!raw || raw.length > 300) return null;
    const [expires, nonce, mac, extra] = raw.split('.');
    if (extra || !/^\d+$/.test(expires || '') || !/^[a-f0-9]{32}$/.test(nonce || '') || !/^[A-Za-z0-9_-]{43}$/.test(mac || '')) return null;
    const now = Date.now();
    for (const [id, expiry] of revoked) if (expiry <= now) revoked.delete(id);
    if (+expires <= now || +expires > now + MAX_AGE * 1000 || revoked.has(nonce)) return null;
    if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(signature(expires + '.' + nonce)))) return null;
    return { expires: +expires, nonce };
  }
  const cookieOptions = req => ({ httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/' });
  function routes(app, clients) {
    app.set('trust proxy', 1);
    app.use('/api/owner', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
    app.post('/api/owner/login', require('express').json({ limit: '1kb' }), (req, res) => {
      if (!sameOrigin(req)) return res.status(403).json({ error: 'Please sign in from this game’s owner page.' });
      if (!keys.length) return res.status(503).json({ error: 'Owner sign-in has not been configured yet.' });
      const now = Date.now(), ip = req.ip;
      for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
      const attempt = attempts.get(ip) || { count: 0, until: now + 15 * 60 * 1000 };
      if (attempt.count >= 10) return res.status(429).json({ error: 'Too many attempts. Please try again in 15 minutes.' });
      if (!matches(req.body?.password)) {
        attempt.count++; attempts.set(ip, attempt);
        return res.status(401).json({ error: 'Incorrect owner password.' });
      }
      attempts.delete(ip);
      const value = (now + MAX_AGE * 1000) + '.' + crypto.randomBytes(16).toString('hex');
      res.cookie(COOKIE, value + '.' + signature(value), { ...cookieOptions(req), maxAge: MAX_AGE * 1000 });
      res.json({ ok: true });
    });
    app.post('/api/owner/logout', (req, res) => {
      if (!sameOrigin(req)) return res.sendStatus(403);
      const session = read(req);
      if (session) {
        revoked.set(session.nonce, session.expires);
        for (const client of clients.values()) if (client.ownerSession?.nonce === session.nonce) {
          client.admin = false; client.ownerSession = null;
          if (client.ws.readyState === 1) client.ws.send(JSON.stringify({ type: 'auth', ok: false }));
        }
      }
      res.clearCookie(COOKIE, cookieOptions(req));
      res.json({ ok: true });
    });
  }
  return { matches, read, sameOrigin, routes };
}
module.exports = { createOwnerAuth };
