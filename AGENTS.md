# Developer Guidelines: Styling, Folder Structure, and Coding Practices

Welcome to the Tionix ERP Frontend codebase. This document outlines the project structure, styling rules, coding standards, and best practices. Please follow these guidelines closely to maintain uniformity, type safety, and premium aesthetics.

---

## 1. Folder Structure Overview

We follow a modular, domain-driven structure to organize code. Shared utilities reside in the global directories, while feature-specific logic is isolated into domain modules.

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router Pages (Entry points)
│   │   ├── (dashboard)/     # Route group for dashboard views
│   │   ├── (hrms)/          # Route group for HRMS views
│   │   └── administrator/   # Admin panels (Users, User Rights, etc.)
│   ├── components/          # Shared Component Layer
│   │   ├── ui/              # Low-level UI primitives (buttons, inputs, dialogs)
│   │   ├── common/          # Highly-reusable layout helper components (confirm-dialog, search-box)
│   │   ├── shared/          # Complex layout components used across pages (Toolbar)
│   │   └── layout/          # Shells, sidebars, headers, footers
│   ├── modules/             # Domain-Driven Modules (Core Feature Logic)
│   │   ├── account-groups/  # Account groups feature
│   │   ├── user-right/      # User rights feature
│   │   └── <domain>/        # Structure pattern for new domains (see below)
│   ├── lib/                 # Shared configurations (themes.ts, utils.ts)
│   ├── hooks/               # Global custom hooks
│   └── locales/             # i18n JSON translations (en, ar, hi)
```

### Module Folder Structure Pattern

Every feature module inside `src/modules/<domain>` must adhere to this pattern:

- `components/`: UI components exclusive to this feature (e.g., lists, grids, forms, tree views).
- `hooks/`: TanStack Query hooks for queries and mutations interfacing with the domain API.
- `services.ts`: Base fetchers, Axios instances, and mutation endpoints for the module.
- `types.ts`: TypeScript definitions and models for API inputs/outputs.

> [!IMPORTANT]
> Do not add feature-specific components directly to `src/components`. Keep them isolated inside `src/modules/<domain>/components`.

---

## 2. Styling and Theme Guidelines (Tailwind CSS v4 & OKLCH)

### Tailwind CSS v4 & OKLCH Tokens

- We use Tailwind CSS v4 loaded via `@import 'tailwindcss'` in `src/app/globals.css`.
- Semantic colors are mapped to CSS variables inside `@theme inline` in `globals.css`.
- Color tokens use **OKLCH** formatting (e.g., `oklch(0.53 0.12 165)`) for uniform perceptual lightness and high visual precision.

### Theme Alignment and Contrast Rules

- Themes are registered dynamically in `src/lib/themes.ts` (mapping to `ThemeName` and `themeList`) and loaded as class selectors in `globals.css` (e.g., `.dark`, `.orange-light`, `.emerald-teal-dark`).
- **Contrast Safeguards**: Ensure a high contrast ratio between `--primary` and `--secondary` colors. For dark modes, `--secondary` background colors should be dark (e.g., forest green `#022c22` in `emerald-teal-dark` paired with teal `--primary` `oklch(0.58 0.12 165)`).
- **Hover & Active States**: Interactive elements must support micro-interactions. Add transitions (`transition-all`) and slight hover/active background adjustments.
- **Premium Aesthetics & Glows**: Use absolute-positioned background glow radials for high-end layouts:
  ```html
  <div
    className="absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial from-brand/15 to-transparent opacity-30 blur-3xl"
  />
  ```

### RTL Compatibility

- Always structure components to respect directionality (e.g., using `dir={isRtl ? 'rtl' : 'ltr'}`).
- Use standard Tailwind logical properties or apply localized spacing overrides based on dynamic `isRtl` evaluations.

---

## 3. Code Practices & Conventions

### A. The Standardized Toolbar Interface

Every CRUD page or entity management panel must use the `Toolbar` component from `@/components/shared/toolbar` to organize page actions and utilities.

- **Left-Side Actions (CRUD Operations)**:
  - `primary`: Add New, Save (maps to standard default button style).
  - `secondary`: Edit, Refresh (maps to secondary button style).
  - `danger`: Delete (maps to red destructive button style).
  - `outline`: Cancel (formerly "Undo", maps to transparent border button style).
- **Right-Side Utilities (Layout Controls)**:
  - Use the `variant: 'icon'` mapping for standard actions (Print, Export, Help, Exit).

### B. Form Cancellation & Safety Protocols

- A user's intent to "Cancel" or "Undo" edits should restore the form data to its previous state (or clear it if adding a new entry).
- When executing a cancel operation, reset both `editable` and `dirty` states to `false`.

### C. Fetching & State Cache Management

- Do not query APIs directly within page components.
- Encapsulate requests using **TanStack Query** in `src/modules/<domain>/hooks`.
- Ensure mutations properly invalidate related query caches to trigger instant data synchronization across list and detail views.

### D. Localization (i18n)

- Wrap page text in standard localization translations using the `useTranslation` hook.
- Avoid inline `LOCALES` dictionaries in component files. Migrate dictionaries to the centralized JSON structures in `src/locales`.

### E. Database Property Naming and Case Rules

To maintain perfect alignment with the backend and PostgreSQL database columns:

- **Username Naming**: Always use `username` (fully lowercase). Do not use camelCase `userName` or snake_case `user_name` in types, states, or variables.
- **Primary Keys**: Always use `pk_user_id` (fully lowercase snake_case). Do not use camelCase `pkUserid` or `pkUserId`.
- **Properties/Variables Matching Database Columns**: Ensure that all frontend module types and variable property names exactly match their database column counterparts (e.g., `fk_set_id`, `fk_prod_id`, `id`, `form`, `rights`). Avoid converting database property names to camelCase on the frontend.

---

## 4. Codebase Analysis & Recommendations for Improvement

After auditing the current frontend codebase, here are key analysis points and recommendations:

### 1. Unified Variant Typings (Fixed)

- **Status**: Fixed.
- **Issue**: The standard `Action` type (in `src/components/shared/toolbar.tsx`) only defined `'primary' | 'secondary' | 'danger' | 'success' | 'icon'` as variants, which caused TypeScript compile-time errors when pages passed `variant: 'outline'` or `variant: 'destructive'`, as well as mismatch errors in `variantMap` and `hrms-toolbar.tsx`.
- **Resolution**: Extended the `Action` variant union to include `outline` and `destructive` and mapped them consistently in `toolbar.tsx` and `hrms-toolbar.tsx`.
- **Takeaway**: Keep components' type signatures aligned with their implementation maps to avoid builds breaking.

### 2. Localization Code Smell (Inline dictionaries)

- **Status**: Pending Refactor.
- **Issue**: `src/app/administrator/users/page.tsx` defines a massive inline dictionary (`LOCALES`) supporting English, Arabic, and Hindi translations.
- **Recommendation**: Move this translation mapping out of the component and insert it into `src/locales/en/common.json` (and matching language files). This keeps component files cleaner and improves translation reusability.

### 3. Hardcoded Magic Numbers

- **Status**: Action Needed.
- **Issue**: `src/app/administrator/user-rights/page.tsx` passes a hardcoded `operator_id: 1` when mutating permissions.
- **Recommendation**: Wire this up with user session properties or client environment variables to avoid data sync conflicts.

### 4. Hardcoded Layout Offsets

- **Status**: Enhancement.
- **Issue**: Screens use pixel subtractions for main panel height controls, such as `h-[calc(100vh-270px)]`. This can break on different window/device viewports.
- **Recommendation**: Replace fixed subtractions with CSS Flexbox layouts using `flex-1 min-h-0` on container cards to allow responsive scaling.

### 5. Eye Icon Repetitions

- **Status**: Enhancement.
- **Issue**: Password toggling eye buttons in forms are manually positioned using relative/absolute alignments and top offsets (e.g., `style={{ top: 'calc(50% + 8px)' }}`).
- **Recommendation**: Add a `showPasswordToggle` boolean prop inside `FormInput` (`src/components/common/form-input.tsx`) to encapsulate this layout automatically.
