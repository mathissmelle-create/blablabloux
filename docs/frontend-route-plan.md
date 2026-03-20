# Frontend Route Plan (Next.js App Router)

## Public / User

- `/` Home (featured cases, live activity, CTA)
- `/cases` Case catalog
- `/cases/[slug]` Case details + open flow
- `/battles` Live battles list
- `/battles/[battleId]` Battle room (players, rounds, synced animation)
- `/roulette` Live roulette
- `/inventory` User inventory
- `/profile` User profile and stats
- `/provably-fair` Fairness history and verifier
- `/seeds` Seed management and rotation
- `/auth/login` Login
- `/auth/register` Register

## Admin

- `/admin` Dashboard
- `/admin/users` User management
- `/admin/roles` Role/permission management
- `/admin/cases` Case list / create / edit
- `/admin/battles` Battle settings
- `/admin/roulette` Roulette settings
- `/admin/fairness` Fairness inspection tools
- `/admin/transactions` Financial/ledger viewer
- `/admin/logs` Audit/system logs
- `/admin/feature-flags` Feature controls
- `/admin/content` Homepage content and banners

## Real-time UX Constraints

- Animation targets are always delivered by backend payload.
- Client syncs using:
  - authoritative `serverTimeMs`
  - `eventVersion`
  - monotonic `sequence`
- Reconnect fetches latest snapshot before replaying live stream.
