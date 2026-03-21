# Battle System Architecture (Authoritative)

## 1) Backend Components

- `BattlesService`
  - creation, join, round resolution, lifecycle transitions
  - immutable case snapshot binding to battle
- `BattleStateMachineService`
  - strict transition validation:
    - `CREATED -> WAITING_FOR_PLAYERS -> LOCKED -> START_COUNTDOWN -> ACTIVE_ROUNDS -> RESOLVING -> COMPLETED`
- `BattleFairnessService`
  - deterministic per-seat per-round item derivation from:
    - serverSeed + EOS block hash + battleId + roundNumber + seatIndex
  - weighted winner draw for jackpot and crazy jackpot
- `BattleEventsService`
  - authoritative websocket event emission + persistent event log storage with sequence numbers

## 2) WebSocket Event Contract

Emitted in battle room channel:

- `battle_created`
- `player_joined`
- `battle_locked`
- `countdown_started`
- `round_start`
- `round_animation_start_timestamp`
- `gold_spin_triggered`
- `round_complete`
- `battle_complete`

Each event payload contains:

- `battleId`
- `sequence`
- `serverTimestampMs`
- event-specific authoritative data

## 3) Fairness + Reproducibility

- every round result is computed and persisted before animation start signal
- battle events are persisted in `BattleEvent` table for reconnect-safe replay
- EOS block hash is frozen on battle and reused for deterministic derivation
- gold spin results are persisted in `BattleGoldSpin`

## 4) Frontend Battle Room Structure

- top section: player/team slots + totals + leader highlight
- center section: synchronized reels that stop on backend-selected items
- bottom section: per-round item history timeline
- side section: sync metadata, mode rule labels, jackpot mapping

## 5) Supported Player Layouts

- `1v1`
- `1v1v1`
- `1v1v1v1`
- `2v2v2`
- `3v3`
