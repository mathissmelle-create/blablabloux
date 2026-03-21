# UI Competitor Benchmark Notes

This document captures design cues gathered from public competitor pages and references while upgrading the product UI.

## Sources Reviewed

- https://www.csgoroll.com/case-battles
- https://csgowin.com/casebattles
- public references for Chicken/Skinrave battle pages (limited due anti-bot/timeout access)

## Repeated Premium Patterns Across Competitors

1. **Dense real-time layout**
   - Live battle list always visible.
   - Filters (mode, player count, price range) pinned at top.
   - Immediate action CTA (`Create Battle`) near filters.

2. **Strong hierarchy + chips**
   - Compact stat chips and status pills (live, mode, player slots).
   - Emphasis on key values: pot size, unboxed value, winner state.

3. **Dark metallic visual language**
   - Graphite backgrounds with orange/gold accent highlights.
   - Layered panel depth, subtle gradients, soft glows.
   - Dense but clean card system.

4. **Animation-first game surfaces**
   - Horizontal reel motion with deterministic stop position.
   - Round-to-round pacing and camera-like movement.
   - Event interruption effects for big drops.

5. **Predictable competitive UX**
   - Every battle mode explained.
   - Timeline + scoreboard + spectators visible together.
   - Mode-specific winner logic shown in UI labels.

## What We Implemented in This Iteration

- Upgraded global theme, nav, and page shell hierarchy.
- Added richer battle/case/roulette layouts with premium cards and chips.
- Added deterministic animation stages:
  - `CaseOpeningStage` (authoritative packet reel + gold spin lane)
  - `BattleArenaStage` (round packet playback + gold interruption)
  - `Roulette3DStage` (3D-like wheel spin from server-scripted outcomes)
- Added 3D hover tilt interactions on case cards.
- Strengthened battle backend winner resolution logic (mode-aware finalization + deterministic tie-break).

## Remaining Work for Full Competitor Parity

- Asset quality pass (high-fidelity skin renders, background cinematics, iconography).
- Sound design integration (spin ticks, impact, win fanfare, crowd ambiance).
- WebSocket-driven animation orchestration using actual live packets (not static script placeholders in UI components).
- Motion polish pass with advanced easing curves and timeline choreography across all game pages.
