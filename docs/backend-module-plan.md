# Backend Module Plan (NestJS)

## Core Modules

- `PrismaModule`
  - DB access, transactions, and lifecycle management.
- `ConfigModule`
  - Environment validation and typed configuration.
- `AuthModule`
  - Register, login, refresh rotation, logout-all, session management.
- `UsersModule`
  - Profile, restrictions, role assignments.
- `LedgerModule`
  - Wallet locking, balance ledger, transaction records.
- `AuditModule`
  - Immutable admin and fairness event logging.
- `FairnessModule`
  - Seed pair lifecycle, verifier utilities, fairness records.
- `CasesModule`
  - Case versions, item pools, odds validation, case openings.
- `BattlesModule`
  - Battle lifecycle, rounds, participants, mode rules, EOS integration.
- `RouletteModule`
  - Round scheduler, bets, lock handling, payout handling.
- `RealtimeModule`
  - Socket.IO gateways, sequence versions, snapshot/reconnect sync.
- `AdminModule`
  - Case CRUD, settings, manual adjustments, feature flags.
- `HealthModule`
  - Liveness and readiness endpoints.

## Internal Shared Services

- `LockService`
  - Redis-based distributed lock helper (critical balance/game sections).
- `EventStoreService`
  - Versioned event publication and idempotency tracking.
- `EosService`
  - EOS block target strategy, fetch retries, persistence.

## Security Components

- RBAC decorators + guards.
- Rate-limits by route groups (auth, game create/join, seed rotate).
- Input DTO validation with strict transform whitelist mode.
- CSRF + cookie strategy for refresh endpoints when same-site mode is used.

## Persistence Principles

1. Persist authoritative outcome first.
2. Persist fairness derivation record.
3. Emit realtime event with deterministic timestamp + sequence.
4. Never accept client-provided outcomes.
