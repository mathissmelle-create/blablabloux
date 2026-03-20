# Architecture Diagram

```mermaid
flowchart LR
  U[User Browser] -->|HTTPS / WS| N[Nginx]
  N -->|/| W[Next.js Web App]
  N -->|/api + /socket.io| A[NestJS API]
  A --> P[(PostgreSQL)]
  A --> R[(Redis)]
  A --> E[EOS API Provider]
  A --> Q[BullMQ Workers]
  Q --> P
  Q --> R
```

## Data Trust Rules

- Game outcomes are computed in API/worker processes only.
- Clients receive deterministic animation payloads and snapshots.
- No client-side RNG is trusted for outcome generation.
