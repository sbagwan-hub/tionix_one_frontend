# X-ONE — Condensed Design System (Multi-Theme, v2)

### For dense enterprise data-entry screens (ERP: Master, Transaction, Report, Admin modules)

---

## 0. What changed in v2

Added a **theme layer**: neutrals, typography, spacing, and component geometry stay fixed (that's the actual design system); only the **primary accent** swaps per theme. This is the correct architecture for enterprise software — tenants/orgs may want to reflect their own brand color without engineering re-doing the whole UI. Three light themes are provided; dark mode remains a Phase 2 recommendation per v1.

---

## 1. Design Philosophy (unchanged from v1)

Still a tool, not a marketing surface. Neutrals carry 90% of the UI; a single accent color is used sparingly for primary actions, focus, links, and active states — never as a large fill. This is why re-theming is cheap: swap one 5-step color ramp, everything else (contrast ratios, spacing, type) holds.

---

## 2. Color System

### Neutral (identical across all themes)

| Token         | Hex       | Usage                             |
| ------------- | --------- | --------------------------------- |
| `neutral-25`  | `#FBFCFD` | App background                    |
| `neutral-50`  | `#F8FAFC` | Section card / input fill accents |
| `neutral-100` | `#F1F5F9` | Input fill (resting), badges      |
| `neutral-200` | `#E2E8F0` | Borders, dividers                 |
| `neutral-300` | `#CBD5E1` | Input border (resting)            |
| `neutral-400` | `#94A3B8` | Placeholder text, disabled icons  |
| `neutral-500` | `#64748B` | Secondary/help text               |
| `neutral-600` | `#475569` | Icon default                      |
| `neutral-700` | `#334155` | Body text                         |
| `neutral-800` | `#1E293B` | Headings, nav bar                 |
| `neutral-900` | `#0F172A` | Primary text                      |

### Semantic (identical across all themes — never overloaded by the accent)

| Token         | Hex       | Usage                    |
| ------------- | --------- | ------------------------ |
| `success-600` | `#16A34A` | Saved, active, valid     |
| `warning-600` | `#D97706` | Draft, pending           |
| `danger-600`  | `#DC2626` | Delete, validation error |
| `info-600`    | `#2563EB` | Informational badges     |

Semantic colors stay constant even when the **Blue** theme is active, so "blue" never gets confused for "info" — the accent and the info-semantic happen to share a hue in that one theme, which is exactly why component states must never rely on hue alone (we always pair with icon + label, per WCAG 1.4.1).

---

### Theme A — Ocean Blue _(trust, financial/back-office default)_

| Token         | Hex       | On white        | Notes                          |
| ------------- | --------- | --------------- | ------------------------------ |
| `primary-50`  | `#EFF6FF` | —               | Selected-row bg                |
| `primary-100` | `#DBEAFE` | —               | Hover bg                       |
| `primary-500` | `#3B82F6` | 3.1:1           | Icon accents (large text only) |
| `primary-600` | `#2563EB` | **4.5:1 ✅ AA** | Buttons, links, focus ring     |
| `primary-700` | `#1D4ED8` | 6.3:1 ✅ AA     | Hover/pressed                  |

### Theme B — Signal Orange _(from the existing X-ONE mark; default in v1)_

| Token         | Hex       | On white        | Notes                          |
| ------------- | --------- | --------------- | ------------------------------ |
| `primary-50`  | `#FFF7ED` | —               | Selected-row bg                |
| `primary-100` | `#FFEDD5` | —               | Hover bg                       |
| `primary-500` | `#F97316` | 3.0:1           | Icon accents (large text only) |
| `primary-600` | `#EA580C` | **4.6:1 ✅ AA** | Buttons, links, focus ring     |
| `primary-700` | `#C2410C` | 6.1:1 ✅ AA     | Hover/pressed                  |

### Theme C — Deep Violet _(chosen as the third: distinct hue-family from both blue and orange so the three read as genuinely different identities, not tints of one hue; also disambiguates from the `info-600` blue used in semantic states)_

| Token         | Hex       | On white        | Notes                          |
| ------------- | --------- | --------------- | ------------------------------ |
| `primary-50`  | `#F5F3FF` | —               | Selected-row bg                |
| `primary-100` | `#EDE9FE` | —               | Hover bg                       |
| `primary-500` | `#8B5CF6` | 3.7:1           | Icon accents (large text only) |
| `primary-600` | `#7C3AED` | **4.8:1 ✅ AA** | Buttons, links, focus ring     |
| `primary-700` | `#6D28D9` | 6.7:1 ✅ AA     | Hover/pressed                  |

**Why these three specifically:** they sit roughly 90–150° apart on the hue wheel (blue ≈ 217°, orange ≈ 21°, violet ≈ 262°), so at-a-glance they're unmistakable from each other — a requirement if a screenshot, support ticket, or training video needs to reference "the orange org" vs "the blue org" unambiguously. All three pass 4.5:1 white-text-on-primary-600 for AA button text.

---

## 3. Typography, Spacing, Components, Motion, Tokens

Unchanged from v1 — see prior deliverable. Summary:

- **Type:** Inter (UI) + IBM Plex Mono (data/IDs/dates), 14px body floor.
- **Spacing:** 8pt grid — `2·4·8·12·16·24·32·40·48·64`.
- **Radius:** `sm 6px · md 8px · lg 12px · full 999px`.
- **Components:** input (40px height, bordered, focus ring in `primary-100`), section card (white, `neutral-200` border, 12px radius), buttons (primary/secondary/danger/ghost), sticky section progress rail with completion tracking.

---

## 4. Theme Switching — implementation

Single CSS variable indirection: base tokens live on `:root`, each theme overrides only `--primary-*` under `:root[data-theme="orange|blue|violet"]`. No component CSS references a hex value directly — everything reads `var(--primary-600)` etc., so adding a 4th theme later is a 5-line addition, not a re-skin.

```css
:root[data-theme='blue'] {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
}
:root[data-theme='orange'] {
  --primary-50: #fff7ed;
  --primary-100: #ffedd5;
  --primary-500: #f97316;
  --primary-600: #ea580c;
  --primary-700: #c2410c;
}
:root[data-theme='violet'] {
  --primary-50: #f5f3ff;
  --primary-100: #ede9fe;
  --primary-500: #8b5cf6;
  --primary-600: #7c3aed;
  --primary-700: #6d28d9;
}
```

```json
{
  "theme": {
    "blue": {
      "primary": {
        "50": "#EFF6FF",
        "100": "#DBEAFE",
        "500": "#3B82F6",
        "600": "#2563EB",
        "700": "#1D4ED8"
      }
    },
    "orange": {
      "primary": {
        "50": "#FFF7ED",
        "100": "#FFEDD5",
        "500": "#F97316",
        "600": "#EA580C",
        "700": "#C2410C"
      }
    },
    "violet": {
      "primary": {
        "50": "#F5F3FF",
        "100": "#EDE9FE",
        "500": "#8B5CF6",
        "600": "#7C3AED",
        "700": "#6D28D9"
      }
    }
  }
}
```

**Where the switch should live in the real product:** Settings → Appearance, persisted per-user (not per-org, unless the business decision is to lock branding org-wide — that's a product call, not a design one). In the mockup, a lightweight swatch picker is placed in the context strip for demo purposes only.

---

## 5. Open items (unchanged priorities from v1, still valid)

1. Standardize icon set to one library/weight (currently mixed, independent of theme).
2. Add inline validation states (error/success) — theme-aware but currently unbuilt.
3. Differentiate toolbar "system context" vs "page actions" styling.
4. Dark mode — needs its own neutral ramp per theme (a dark violet ≠ inverted light violet); scope as its own pass, not a `filter: invert()` shortcut.
