# Frontend Design System (Gaming UI)

## Color Tokens

- Base background: `#07090d` (deep dark neutral)
- Mid background: `#0b1018`
- Primary surface: `#121721`
- Secondary surface: `#0e141d`
- Accent: `#ffad33` (used for high-priority action)
- Accent soft: `#ffd27e`
- Text secondary: `#8f9db3`
- Semantic:
  - success `#22c55e`
  - danger `#ef4444`
  - warning `#f59e0b`
- Rarity:
  - blue / purple / pink / red / gold (`rarity*` tokens)

## Typography

- Body: Inter
- Display / section emphasis: Orbitron
- Hierarchy:
  - H1: reserved for page identity
  - H2/H3: section focus and game state markers
  - Micro labels: uppercase 11px tracking for telemetry/meta

## Spacing Rhythm

- Core scale: `4 / 8 / 12 / 16 / 24`
- Dense gaming layout:
  - reduced empty vertical padding
  - more informative blocks above fold
  - compact rows for live battle visibility

## Component Tokens

- Radius: 10px to 14px
- Border: cool-gray stroke, stronger on hover/focus
- Depth: subtle layered shadow (`shadow-panel`)
- Glow: only on critical action / high rarity events

## Motion Rules

- Hover lift: tiny y-offset (`-2px`) or contrast increase
- Reels/wheels: deterministic target, controlled ease-out
- Number transitions: short, non-bouncy
- Page transitions: short fade/slide only

## Anti-generic Rules Applied

- Deliberate information density for gameplay context
- Asymmetric sections where useful (hero split, content rail)
- Consistent visual rhythm across cards/lists/timelines
- No generic “SaaS dashboard” spacing or control styles
