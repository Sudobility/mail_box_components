# mail_box_components (@sudobility/components)

> **Git: never auto-commit or auto-push.** Leave work in the working tree; run
> `git commit`/`push`/`gh pr create`/`scripts/push_all.sh` only when the user asks
> in that turn. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it. Stay on the current branch —
> no feature branches.

A React component library built on Radix UI primitives, styled with Tailwind and
the centralized `@sudobility/design` tokens. Ships ES modules only (no UMD) with
TypeScript declarations. Bun; React 19 (peer `>=18`), TypeScript 6, Vite 8,
Vitest 4, Tailwind 4. Single npm package with 48 domain subpath exports (built
from top-level `src/` folders via the `exports` map) — not a monorepo, no
`packages/` dir. Published to GitHub Packages (`.npmrc` scopes `@sudobility`). The
React Native port is `@sudobility/components-rn` (repo `mail_box_components_rn`) —
if a component exists here and not in RN, port it there rather than reimplementing.

Each component's own behavior and rationale live in its file header comment —
read the component before changing it. This file holds only cross-cutting facts.

## Commands

- `bun install` — dependencies
- `bun run build` — `tsc && vite build && scripts/fix-esm-imports.mjs`
- `bun run dev` — vite build --watch
- `bun run type-check` — `tsc --noEmit`
- `bun run lint` — ESLint flat config, `--max-warnings 0`
- `bun run format` / `format:check` — prettier
- `bun run test:unit` — vitest run (single file: `bun run test:unit src/__tests__/button.test.tsx`)
- `bun run test:ui` — vitest UI

## Architecture & load-bearing facts

- **Dual-package design system.** Depends on the separate `@sudobility/design`
  package (sibling `../design_system`) for tokens, colors, typography and variant
  functions (`variants as v`, e.g. `v.button.primary.default()` → Tailwind class
  strings). It is listed in the Rollup `external` array (vite.config.ts) so it is
  not bundled; consumers provide it as a peer.
- **Styling composition order is `cn(cvaVariants, designSystemClass, userClassName)`**
  — base, then design system, then overrides. `cn()` (`src/lib/utils.ts`) is
  clsx + tailwind-merge to resolve Tailwind conflicts; variants are defined with
  `class-variance-authority` (CVA); design classes come from `@sudobility/design`.
- **Component pattern:** `forwardRef` + `cn` + CVA, `displayName` set, exported
  from the component file *and* from its category `index.ts`. **A new component is
  invisible until its category index reaches the main barrel** `src/index.ts` —
  verify both hops.
- **Radix UI** supplies accessible unstyled primitives (dialog, alert-dialog,
  select, switch, tabs, label, slot for the polymorphic `asChild`); wrap them with
  Tailwind + `cn()`.
- **Tailwind:** dark mode via the `class` strategy; HSL CSS-custom-property
  theming (`hsl(var(--primary))`, …). An arbitrary-value class only exists in a
  consuming app whose Tailwind build scans this file — state such geometry as a
  `style`, not a class, when the component must stand alone.
- **Theme** (`src/core/theme/`): `ThemeProvider` + `useTheme()`, `Theme.LIGHT/DARK/SYSTEM`.
- **Build:** `tsc && vite build && node scripts/fix-esm-imports.mjs`. Vite 8
  library mode, ES format only (`formats: ['es']`); entries are `src/index.ts`
  plus one per domain subpath (derived from the `exports` map in vite.config.ts),
  output `dist/<name>.js` + `.d.ts` via `vite-plugin-dts`, `@/` → `src`, peer deps
  externalized. `fix-esm-imports.mjs` rewrites tsc's extensionless relative
  imports to explicit `./x.js` / `./dir/index.js` so Node's ESM loader resolves them.
- **Testing:** Vitest + jsdom + React Testing Library, setup `src/test/setup.ts`,
  global APIs enabled, 80% coverage thresholds. Geometry-dependent behavior
  (menu placement, etc.) jsdom cannot see is checked in a consuming app's browser e2e.
- **ESLint** flat config (`eslint.config.js`): `@typescript-eslint`, react-hooks,
  react-refresh, prettier-as-error; unused vars ignore `^_`; `no-console` warn
  (allows `warn`/`error`).

## Peer dependencies (required by consumers)

`react`/`react-dom` ≥18 · `@sudobility/design` · `@sudobility/types` · the
`@radix-ui/react-*` primitives (dialog, alert-dialog, select, switch, tabs,
label, slot) · `@heroicons/react` · `class-variance-authority` · `clsx` ·
`tailwind-merge` · `react-router-dom` · `react-i18next`/`i18next` · `web-vitals`.
Optional peers (only for the components that use them, `peerDependenciesMeta`):
`firebase`, `@sudobility/di`, `recharts`, `@sudobility/subscription_lib`,
`@revenuecat/purchases-js`.

## i18n

`react-i18next`/`i18next` are peers; `useLocalizedNavigate` does language-prefixed
routing; `LanguageValidator`/`LocalizedLink` live in `src/core/i18n-routing/`.

## Structure

`src/` groups components by domain; put a new one in the matching category and
export it up the barrel chain:

- `primitives/` — `layout/`, `typography/`, `feedback/` building blocks
- `forms/` — `inputs/`, `advanced/`, `builders/`
- `ui/` — generic flat components (Button, Card, Modal, Tabs, Select, …) + `toast/`
- `navigation/`, `data-display/`, `charts/`, `media/`, `modals/`, `interactive/`
- `core/` — app-level (`auth/`, `error/`, `i18n-routing/`, `icons/`, `theme/`, …)
- `layout/` — page-level (slot-based `Footer`/`Topbar`, `MasterDetailLayout`, …)
- `features/`, `kyc/`, plus domain folders (`finance/`, `healthcare/`, …)
- `optimization/`, `dev-tools/` (`PerformancePanel`), `hooks/`, `utils/`
- `platforms/` — `WebStyleGenerator` turns design-system data into Tailwind classes
- `lib/` — `cn()` · `test/` — vitest setup · `__tests__/`
