# CS2 Prime Platform (Monorepo)

Production-focused CS2-themed platform foundation with:

- Case Opening
- Case Battles
- Roulette
- Provably fair architecture
- Authoritative realtime event model
- Admin operations surface

## Stack

- **Frontend**: Next.js + TypeScript + Tailwind + Framer Motion + GSAP + Zustand + TanStack Query
- **Backend**: NestJS + Prisma + PostgreSQL + Redis + BullMQ + Socket.IO
- **Security**: JWT access/refresh rotation, Argon2id, validation pipes, helmet, throttling, audit logs
- **Infra**: Docker, docker-compose, Nginx reverse proxy

## Monorepo

- `apps/api`: authoritative game backend
- `apps/web`: customer/admin frontend
- `packages/shared`: shared enums/types
- `docs`: architecture and game rules
- `infra/nginx`: reverse proxy config

## Getting Started

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
docker compose up --build
```

## Phase Tracking

- Phase 1 (current baseline):
  - monorepo structure
  - architecture docs
  - Prisma schema
  - env templates
  - Docker setup
  - auth/roles/fairness interface foundation
  - frontend route scaffolding

Further phases will implement game engines, realtime synchronization, EOS battle randomness, admin workflows, testing depth, and final hardening.
