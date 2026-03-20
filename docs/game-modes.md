# Game Mode Rules

This file defines deterministic backend rules for battle modes. All outcomes are computed server-side and persisted before any realtime event is emitted.

## Standard Mode

- Winner is participant/team with highest total value after all rounds.
- Tie:
  - compare highest single item value
  - then second highest
  - if still tied, deterministic tie-breaker ticket using fairness engine

## Crazy Mode

- Winner is participant/team with **lowest** total value.
- Same tie-breaker chain as standard mode.

## Jackpot Mode

- All participant winnings are pooled.
- Winning probability per participant/team is proportional to total contributed value.
- Deterministic jackpot ticket derived from battle fairness input.

## Terminal Mode

- Terminal mode is **last-round-decides**:
  - only the final round's value is used to decide the winner
  - prior rounds still contribute to timeline and history, but not terminal winner scoring
- Solo terminal:
  - participant with highest value in final round wins
- Team terminal:
  - team with highest combined final-round value wins
- If final-round values tie:
  - deterministic fairness tie-break ticket selects winner

## Crazy Jackpot

- Pooling and weighted winner selection like jackpot mode.
- Weight is inverted by value rank (lower value -> better chance), normalized deterministically.
- Final selection uses deterministic fairness ticket.

## Team Modes (2v2v2, 3v3)

- Team total is sum of member round outcomes.
- Team tie-breakers compare member highest items, then deterministic ticket.

## Fairness Implications

- For each round and seat:
  - derive ticket from: battleServerSeed + eosBlockHash + battleId + roundNumber + seatIndex
- Store derivation inputs and ticket in immutable fairness records.
