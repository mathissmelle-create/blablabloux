# Implementation Phases

## Phase 1 (implemented baseline)

- Monorepo layout (`apps/api`, `apps/web`, `packages/shared`)
- Architecture, backend/frontend plans, admin IA docs
- Prisma schema with normalized entities
- Env templates and Docker/compose/Nginx setup
- Initial auth foundation and RBAC model primitives
- Fairness engine interfaces and verifier endpoint
- Frontend route skeleton with premium theme baseline

## Phase 2 (implemented core)

- Deterministic fairness engine service (HMAC SHA-256)
- Authoritative case opening service
  - transactional wallet debit
  - case outcome persistence
  - fairness record persistence
- Inventory insertion on wins
- Admin case creator/versioning API with weight validation and ticket snapshots

## Phase 3 (implemented initial pass)

- Battle creation/join APIs
- EOS head block targeting + block hash retrieval service
- Initial realtime gateway with versioned/sequenced envelopes
- Battle round resolution function using EOS + fairness derivation

## Phase 4 (implemented initial pass)

- Roulette round lifecycle and history
- Authoritative bet placement and lock handling
- Deterministic roulette resolution and payouts
- Fairness persistence for roulette results
- Provably fair frontend page shell

## Phase 5 (current baseline)

- Fairness unit tests and deterministic battle-flow test
- Workspace build/test verification
- Deployment/architecture documentation

## Remaining hardening tasks before production launch

- Redis distributed locks integrated into all critical game paths
- Full websocket reconnect snapshot + replay across clustered nodes
- Battle mode-specific winner settlement and tie-break finalization
- Scheduled roulette round workers and backpressure controls
- Full e2e suite (Playwright + API e2e) and CI quality gates
- External security and compliance audits
