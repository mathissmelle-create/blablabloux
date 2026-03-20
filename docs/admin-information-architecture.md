# Admin Panel Information Architecture

## 1. Dashboard

- Platform KPIs: active users, revenue, house edge, game volume
- Live operational alerts: queue failures, EOS fetch failures, abnormal error rates
- Quick actions: freeze withdrawals, toggle features, open incident notes

## 2. User Operations

- Search/filter users by id, email, username, risk score
- View profile, restrictions, wallet, inventory, session map
- Actions (audited): role change, ban/mute/restrict, manual balance adjustment

## 3. Case Operations

- Case list (active/inactive)
- Case editor:
  - metadata (name, slug, image, price)
  - weighted item pool editor
  - probability normalization validator
  - expected return preview
  - gold-spin eligibility preview
- Publish process creates immutable `CaseVersion` snapshots

## 4. Battle/Roulette Controls

- Battle mode availability toggles
- Max participant/team settings
- EOS provider status and fallback controls
- Roulette segment configuration and round timing controls

## 5. Fairness and Compliance

- Seed pair lifecycle viewer
- Seed rotation history
- Fairness record inspector per game id
- Verification helper UI (same formula as backend service)

## 6. Finance and Logs

- Balance ledger explorer
- Transaction explorer with references
- Audit logs and suspicious activity stream

## 7. Content and Flags

- Homepage banners / featured cases
- Experiment and rollout flags
- Environment-scoped feature toggles
