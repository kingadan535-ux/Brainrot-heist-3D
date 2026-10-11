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

When the game is on a separate static host, deploy only `index.html`, `network.js`, `config.js`, `game-rules.js`, and `movement.js` there. Set `window.BRAINROT_SERVER_URL` in that host's `config.js` to your actual Render HTTPS origin or full secure WebSocket URL ending in `/ws`. Deploy the updated `server.js` on Render as well: a frontend-only update cannot enable trades and second-floor synchronization on the old backend.

Render documentation:
- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/websocket

## Owner panel

Open `/owner` and sign in with your private owner password. Set `OWNER_ACCESS_KEY` in Render to configure this password; an existing `ADMIN_TOKEN` is also accepted. Never place either secret in public frontend files or commit them. After successful sign-in the original panel opens, and its Admin button remains visible to that authenticated browser. Ordinary visitors have no admin access.

## Shared bases, rebirth, and stealing

- Rebirth clears inventory and restarts cash at $100, saved immediately. Finish active steals or trades before rebirthing.
- The server assigns one of eight fixed base slots. Every player renders the same assignment; joining/leaving does not shuffle existing players.
- A thief picks up a brainrot at its actual base location and must carry it to their own assigned base.
- There is no remote Defend shortcut for player theft. Find the thief and bonk them within bat range to return the item automatically.
- The original slot stays reserved during a steal. Disconnects return the item, and duplicate return requests cannot create copies.
- Both players need to refresh after this update.

## What changed

- Loads the multiplayer adapter before the original game.
- Supports a separate Render server and the `/ws` protocol.
- Shows connecting, online, and reconnecting status.
- Reconnects and rejoins the selected lobby, restoring presence.
- Handles initial lobby counts and rosters arriving immediately after a join.
- Relays trades and all 16 inventory slots, second-floor state, and player elevation.
- Adds server heartbeat, a health endpoint, and bounded WebSocket payloads.
- Serves only the game's public files rather than the whole repository.
- Restores the owner panel through /owner sign-in (also opened by Ctrl+Shift+A). A signed, HttpOnly cookie remembers the owner for 7 days and restores access after reconnects. Sign out revokes the current browser session.

## Verification

Twenty-nine automated tests pass, using real WebSocket clients against the actual server and the actual remote animation and owner UI routines. They cover script loading and syntax, two-player presence, trades, room isolation, admin authorization, reconnect/rejoin, lobby counts, the eight-player limit, invalid codes, and same-origin URL handling. Two real browser sessions additionally verified matching belt items, high-index admin mutations, carrying restrictions, bonk returns and visible ragdolls, Space jumping, and contested purchases. Desktop and touch layouts were visually checked.

The existing service is https://brainrot-heist-3d.onrender.com. After deployment, /healthz should return protocol 2. Verify two clients in a shared lobby before inviting players.

## Existing game limitations

Progress remains stored in each browser's localStorage. A new domain has separate saved progress. The multiplayer server relays client-reported game state; it is not an authoritative economy. In-flight steals, deposits, and bonk returns are coordinated by the server, and belt spawning and purchases are coordinated by the server. Saved inventory and earnings are still client-reported. Trades retain their previous behavior and are not guaranteed to be atomic across network failures. Keep this in mind for public playtesting. Accounts and persistent server saves would be a separate feature.

## Shared belt and movement

Each lobby has one server-run belt, including admin spawns, auto-spawns, mutations and guaranteed rarity timers. Item IDs and positions are sent to all players and late joiners. A purchase removes the same item for everyone, and simultaneous buyers cannot both receive it. Owner-only base grants synchronize all 1,898 item variants.

Space jumps; Shift sprints. Touch players have Jump and Sprint buttons. Carrying prevents sprinting and hitting. Base back and side walls block movement, including jump and knockback movement, while entrances stay open unless locked for visitors. A bonk throws the victim into an animated ragdoll and blocks movement and actions for 1.5 seconds. Refresh every client after deploying.
