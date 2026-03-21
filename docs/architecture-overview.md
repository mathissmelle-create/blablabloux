# CS2 Platform Architecture Overview

## Monorepo Structure (Phase 1 Baseline)

```text
.
├── apps
│   ├── api                      # NestJS authoritative backend
│   │   ├── prisma               # Prisma schema + migrations + seed
│   │   └── src                  # Modules (auth, fairness, games, admin, ws)
│   └── web                      # Next.js frontend (app router)
│       ├── app                  # Product routes and admin routes
│       ├── components           # UI components and layout shells
│       └── lib                  # API, socket, auth, query client
├── packages
│   └── shared                   # Shared enums/types/zod contracts
├── infra
│   └── nginx                    # Reverse proxy config
├── docs                         # Technical docs and mode rules
└── docker-compose.yml
```

## High-level Runtime Topology

1. **Next.js frontend** renders all user/admin pages and subscribes to WebSocket rooms.
2. **NestJS API** is the authoritative source of truth for game states, balances, and fairness records.
3. **PostgreSQL** stores immutable game outcomes, financial ledgers, and fairness metadata.
4. **Redis** powers:
   - BullMQ job queues
   - distributed locks for balance/game critical sections
   - Socket.IO adapter for horizontal scaling
5. **Nginx** reverse-proxies web, api, and websocket traffic.

## Security Posture (Phase 1 Baseline)

- JWT access + refresh token rotation with revocation store.
- Argon2id password hashing.
- DTO validation via `class-validator` and `ValidationPipe`.
- Helmet, CORS allowlist, and API-level throttling.
- Audit log records for admin/fairness-sensitive actions.
- Transactional balance operations and immutable game result storage patterns.

> Before any real-money launch, an external third-party security and compliance audit remains mandatory (application security, infra hardening, legal/regulatory review, anti-fraud/AML checks).

## Authoritative Real-time Pattern

- Backend emits versioned events with sequence numbers and server timestamps.
- Frontend animates toward backend-decided targets only.
- Reconnect flow:
  1. Client requests snapshot endpoint.
  2. Client applies snapshot and last known sequence.
  3. Client resumes live stream from server-authoritative state.

## Provably Fair Model

- Case open uses: `serverSeed`, `clientSeed`, `nonce`, case version snapshot.
- Battle uses: battle seed hash + EOS block hash + deterministic seat/round derivation.
- Roulette uses: seeded deterministic segment output with round nonce.
- All derivation inputs and outputs are persisted for verifiability.
