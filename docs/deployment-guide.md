# Deployment Guide

## Local Development

1. Copy environment files:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed initial roles/permissions:
   - `npm run prisma:seed`
6. Start everything:
   - `docker compose up --build`

## Services

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
- Nginx: `http://localhost`

## Production Notes

- Use managed PostgreSQL + Redis with backups and replication.
- Rotate JWT and seed-encryption secrets through your secret manager.
- Enable TLS termination at load balancer and enforce HSTS.
- Run Prisma migrations during deployment before app rollout.
- Configure horizontal scale:
  - Socket.IO with Redis adapter
  - BullMQ workers as dedicated processes

## Pre-launch Checklist

- External security audit and penetration testing.
- Compliance and jurisdictional legal review.
- Fraud prevention and payout risk controls.
- Incident response playbook and observability dashboards.
