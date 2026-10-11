# Brainrot Heist 3D Online

Original game kept in `index.html`. `network.js` replaces the Claude room integration with a WebSocket-compatible API. `server.js` hosts the game and relays multiplayer events.

## Run

1. Install Node.js 18+.
2. Run `npm install`.
3. Set an admin secret with `ADMIN_TOKEN=your-long-random-secret` (set it in your host's environment variables, not in browser code).
4. Run `npm start`.
5. Open http://localhost:3000 in two browser windows to test multiplayer.

## Deploy

Deploy the full folder to a Node.js hosting provider that supports persistent WebSockets (e.g. Render web service or Railway). Build: `npm install`; start: `npm start`. Set `ADMIN_TOKEN` in the host's environment settings. Use the public HTTPS URL. Do not use static-only Netlify Drop for this multiplayer version.

## Admin

Press Ctrl+Shift+A in the game and enter your server's ADMIN_TOKEN. On touch devices, use a keyboard or add a dedicated admin-login button before use. Never publish your admin token.

## Limitations / security

Up to 8 connections per lobby. Player position, cash, and brainrot inventory are still client-reported, and saves are still in browser localStorage. The server relays events but does not authoritatively validate ownership, cash, raids, or purchases. This is a functional multiplayer conversion for playtesting, not a cheat-resistant production economy. Admin events are token-gated. To support durable cross-device accounts, secure stealing, and true server-calculated offline income, add authentication, a database, and server-authoritative game state.
