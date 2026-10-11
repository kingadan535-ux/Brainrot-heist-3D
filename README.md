# Brainrot Heist 3D — fixed multiplayer build

This is the complete uploaded game, with its original gameplay and visual design retained. The networking adapter is now loaded before the game starts.

## Run locally

Use Node.js 22 or newer, then run:

```
npm ci
npm test
npm start
```

Open http://localhost:3000 in two separate browser windows. Open Lobby to choose a public lobby or create and share a private code.

## Deploy on your existing Render service

Update the repository files with this build. Use your existing Node web service connected to kingadan535-ux/Brainrot-heist-3D:

- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/healthz`
- Keep a single running instance: lobby membership is held in server memory.
- Optional `ADMIN_TOKEN`: choose a long secret in Render's environment settings; never put it in game code.

When the game and server are on the same Render address, leave `config.js` empty as supplied. The client automatically uses `wss://<your-service>/ws` on HTTPS. Render provides the listening port through `PORT`; the server binds to `0.0.0.0`.

When the game is on a separate static host, deploy only `index.html`, `network.js`, and `config.js` there. Set `window.BRAINROT_SERVER_URL` in that host's `config.js` to your actual Render HTTPS origin or full secure WebSocket URL ending in `/ws`. Deploy the updated `server.js` on Render as well: a frontend-only update cannot enable trades and second-floor synchronization on the old backend.

Render documentation:
- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/websocket

## What changed

- Loads the multiplayer adapter before the original game.
- Supports a separate Render server and the `/ws` protocol.
- Shows connecting, online, and reconnecting status.
- Reconnects and rejoins the selected lobby, restoring presence.
- Handles initial lobby counts and rosters arriving immediately after a join.
- Relays trades and all 16 inventory slots, second-floor state, and player elevation.
- Adds server heartbeat, a health endpoint, and bounded WebSocket payloads.
- Serves only the game's public files rather than the whole repository.
- Implements the documented Ctrl+Shift+A admin sign-in; admin access is cleared on disconnect.

## Verification

Four automated tests pass using real WebSocket clients against the actual server. They cover script loading and syntax, two-player presence, trades, room isolation, admin authorization, reconnect/rejoin, lobby counts, the eight-player limit, invalid codes, and same-origin URL handling. Browser visual QA could not run because the local browser automation runtime failed to start.

The existing service is https://brainrot-heist-3d.onrender.com. After deployment, /healthz should return protocol 2. Verify two clients in a shared lobby before inviting players.

## Existing game limitations

Progress remains stored in each browser's localStorage. A new domain has separate saved progress. The multiplayer server relays client-reported game state; it is not an authoritative economy. Trades and raids retain the original game's behavior and are not guaranteed to be atomic across network failures. Keep this in mind for public playtesting. Accounts and persistent server saves would be a separate feature.
