# Brainrot Heist 3D — fixed multiplayer build

This is the complete uploaded game, with its original gameplay and UI retained and upgraded collectible artwork. The networking adapter is now loaded before the game starts.

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

When the game is on a separate static host, deploy only `index.html`, `network.js`, `config.js`, `game-rules.js`, `movement.js`, `delivery-route.js`, `brainrot-art.js`, and `brainrot-vfx.js` there. Set `window.BRAINROT_SERVER_URL` in that host's `config.js` to your actual Render HTTPS origin or full secure WebSocket URL ending in `/ws`. Deploy the updated `server.js` on Render as well: a frontend-only update cannot enable trades and second-floor synchronization on the old backend.

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

Forty-three automated tests pass, using real WebSocket clients against the actual server and the actual remote animation and owner UI routines. They cover script loading and syntax, two-player presence, trades, room isolation, admin authorization, reconnect/rejoin, lobby counts, the eight-player limit, invalid codes, and same-origin URL handling. Two real browser sessions additionally verified matching belt items, high-index admin mutations, carrying restrictions, bonk returns and visible ragdolls, Space jumping, and contested purchases. Desktop and touch layouts were visually checked.

The existing service is https://brainrot-heist-3d.onrender.com. After deployment, /healthz should return protocol 2. Verify two clients in a shared lobby before inviting players.

## Existing game limitations

Progress remains stored in each browser's localStorage. A new domain has separate saved progress. The multiplayer server relays client-reported game state; it is not an authoritative economy. In-flight steals, deposits, and bonk returns are coordinated by the server, and belt spawning and purchases are coordinated by the server. Saved inventory and earnings are still client-reported. Trades retain their previous behavior and are not guaranteed to be atomic across network failures. Keep this in mind for public playtesting. Accounts and persistent server saves would be a separate feature.

## Shared belt and movement

Each lobby has one server-run belt, including admin spawns, auto-spawns, mutations and guaranteed rarity timers. Item IDs and positions are sent to all players and late joiners. A purchase sends the same item walking to the buyer’s reserved base slot. Before it arrives, another nearby player may purchase it at the listed price to redirect it; the previous buyer is refunded. Simultaneous clicks against the same item revision resolve once. Inventory and income begin only on arrival. Leaving a lobby cancels and refunds pending deliveries. Owner-only base grants synchronize all 1,898 item variants.

Space jumps; Shift sprints. Touch players have Jump and Sprint buttons. Carrying prevents sprinting and hitting. Base back and side walls block movement, including jump and knockback movement, while entrances stay open unless locked for visitors. A bonk throws the victim into an animated ragdoll and blocks movement and actions for 1.5 seconds. Refresh every client after deploying.

## Touch recovery

Movement and camera touches are tracked separately. Global pointer release/cancel, lost capture, and touch identifiers clear the joystick even when its original release is missed. Blur, hidden pages, page exits, orientation changes, and opening a modal reset controls. Real touch-browser tests cover releasing the joystick while holding a camera finger, cancelling a touch, starting again, and toggling sprint.

## Distinct creature artwork (version 2)

Every one of the 146 base characters now has an explicit body and signature design profile. The roster includes separate food silhouettes, many animal anatomies, web-winged dragons, three-headed hydras, giant gorillas, ice mammoths, armored dinosaurs, long sea monsters, centaurs, spiders, and flying creatures. Food details keep the creatures in the game's playful style. Repeated universal rare badges and halos have been removed.

Size increases with rarity. In the sampled animation checks, Secret creatures average approximately 4.8 world units high versus 2.2 for Common characters. Creature names track model height. Species have different locomotion and idle behavior: heavy steps, frog hops, serpentine waves, wingbeats, tentacle motion, rolling, hovering, head movement, and animated accessories. Each instance owns its animated joints; static geometry is shared and batched. All 12 mutations preserve each creature's identity, and original IDs, economy, and saves stay compatible.

Verification: all 37 gameplay tests pass. Real Edge rendering checked 292 desktop/mobile base-model configurations, all 1,752 mutation identity mappings, representative rendered mutations, populated bases, and carrying. Animated vertex samples across 24 poses per configuration stayed under 6.12 units high and 5.74 units wide, within the base's seven-unit floors and 6.2-unit slot spacing. All 146 body/signature pairs are distinct, and every rig animates without affecting another instance. Mobile geometry averaged about 4,616 triangles/model; this profile was tested in desktop Edge, not on a physical phone.

## Layered effects and mutations

Rarity, character identity, mutation, and entrances now render as separate cosmetic layers. All 58 Mythic, Brainrot God, and Secret characters have named effect profiles. Common models stay quiet; Rare and Epic effects are restrained; higher tiers add emissive rims, procedural aura waves, glyphs, instanced orbiting accessories, shader particles, trails, and themed structures. The current roster has no OG tier.

All 12 mutations retain the original character effects and add their own materials and visible accessories, including coins, musical notes, money bags, ice armor, lava cracks and footprints, lightning, ringed planets, toxic symbols, sweets, and animated rainbow color. Static particle geometry is shared, trail buffers are pooled, and per-model resources are disposed on removal. Distance and visible-character budgets reduce effects in crowded scenes.

Use the new Graphics button for Automatic, Low, Medium, or High effects, plus reduced flashes and entrances. Preferences are stored separately from game saves. Automatic chooses a conservative device default and can reduce quality when initial frame times are slow. Low preserves mutation materials and signature accessories. At most two nearby, shadow-free effect lights are enabled on High; glow is local to effects, with no costly fullscreen bloom pass.

The only world-state addition is a server spawn timestamp. Existing item IDs supply deterministic seeds; clients use the timestamp for entrances and suppress duplicate or old presentations. Late joins render ongoing effects without replaying entrances. Secret arrival notices are local presentations of the same lobby event. Effects never lock the camera or movement.

Validation: 43 automated gameplay and effects tests; real Edge renders of all 58 high-rarity profiles and all 12 mutation layers at High and Low; persisted settings; two-client spawn seed/timestamp checks; quiet late join; purchase, delivery, and carry continuity. A 48-character mutated high-rarity stress scene used about 3,404 particles at High versus 151 at Low. Repeated creation/removal kept GPU geometry and texture counts stable, with no shader errors. Browser timings use software-rendered desktop Edge and are not physical-phone FPS claims.
