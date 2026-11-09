# @sudobility/components

Comprehensive React component library and design system: a large set of reusable UI
components built on Radix UI primitives, styled with Tailwind CSS and the
`@sudobility/design` token system. Written in TypeScript, ships ES modules with type
declarations. Beyond the generic UI primitives, 48 domain-specific component groups
(finance, healthcare, ecommerce, web3, …) are published as individual subpath exports
so consumers import only what they use.

This is a single npm package with many entry points, **not** a monorepo — every entry is
built from a top-level folder under `src/` and exposed through the `exports` map in
`package.json`.

## Installation

The package is published to **GitHub Packages**, so the `@sudobility` scope must resolve
to that registry. Add to your project's `.npmrc`:

```
@sudobility:registry=https://npm.pkg.github.com
```

Then install (Bun shown; npm/pnpm/yarn work too):

```bash
bun add @sudobility/components @sudobility/design
```

### Peer dependencies

Required peers (consumers must provide them): `react` / `react-dom` (>=18),
`@sudobility/design`, `@sudobility/types`, the `@radix-ui/react-*` primitives
(alert-dialog, dialog, label, select, slot, switch, tabs), `@heroicons/react`,
`class-variance-authority`, `clsx`, `tailwind-merge`, `react-router-dom`,
`react-i18next`, `i18next`, `web-vitals`.

Optional peers (only needed by the components that use them):
`firebase`, `@sudobility/di`, `recharts`, `@sudobility/subscription_lib`,
`@revenuecat/purchases-js`.

## Usage

Import generic components from the package root:

```tsx
import { Button, Card, Input, DataTable, Tabs, cn } from '@sudobility/components';
import { ThemeProvider, useTheme, Theme } from '@sudobility/components';

function App() {
  return (
    <ThemeProvider defaultTheme={Theme.SYSTEM}>
      <Card>
        <Input placeholder="Enter your name" />
        <Button variant="primary">Submit</Button>
      </Card>
    </ThemeProvider>
  );
}
```

Import domain-specific components from their subpath:

```tsx
import { /* … */ } from '@sudobility/components/finance';
import { /* … */ } from '@sudobility/components/healthcare';
```

## Component groups

### Generic (package root)

- **Primitives** — layout (`src/primitives/layout`), typography, feedback building blocks
- **Forms** — inputs, advanced inputs, and form/survey builders (`src/forms`)
- **UI** — Button, Card, Select, Command, Banner, form-modal, and many more (`src/ui`)
- **Data display** — DataTable and related (`src/data-display`)
- **Charts** — chart components (`src/charts`; require the optional `recharts` peer)
- **Media**, **Modals**, **Interactive**, **Navigation** (`src/media`, `src/modals`, `src/interactive`, `src/navigation`)
- **Core** — ThemeProvider, auth, error boundaries, i18n routing, icons (`src/core`)
- **Layout** — page-level layout such as Footer/Topbar and MasterDetailLayout (`src/layout`)
- **Hooks / utils / optimization / dev-tools** — supporting non-visual exports

### Domain subpaths (48, imported from `@sudobility/components/<name>`)

agriculture, analytics, automotive, collaboration, communication, construction, design,
devops, documents, ecommerce, education, email, energy, entertainment, entity, events,
finance, fitness, food, gaming, government, healthcare, hr, insurance, interaction, iot,
legal, logistics, manufacturing, marketing, media-components, monitoring, nonprofit,
project-management, ratelimit, realestate, retail, scanner, scheduling, scientific,
search, security, social, subscription, travel, visualization, web3, workflow.

## Development

```bash
bun install
bun run build         # tsc + Vite library build (ES) + scripts/fix-esm-imports.mjs
bun run dev           # Vite build in watch mode
bun run type-check    # tsc --noEmit
bun run lint          # ESLint flat config (--max-warnings 0)
bun run format        # Prettier write   (format:check to verify)
bun run test:unit     # Vitest (jsdom + React Testing Library; 80% coverage thresholds)
bun run test:ui       # Vitest UI
```

Run a single test file: `bun run test:unit src/__tests__/button.test.tsx`.

The build outputs ES modules only (`dist/index.js` plus one `dist/<name>.js` per subpath)
with `.d.ts` declarations. CI/CD runs via the shared `johnqh/workflows` reusable workflow
(`.github/workflows/ci-cd.yml`) and publishes to GitHub Packages.

## Related packages

- `@sudobility/design` — design tokens, colors, typography, variant functions (peer; sibling repo)
- `@sudobility/types` — shared TypeScript types (peer)
- `@sudobility/components-rn` — React Native port of this library

## License

BUSL-1.1
