# Hello Daryl

A small, polished landing screen built with React 18 + TypeScript and a
hand-rolled design system (plain CSS custom properties — zero UI dependencies).

## ⚠️ Important — dependencies are NOT installed

This project was authored in a sandbox where the **npm registry was
unreachable** (network mode `INTEGRATIONS_ONLY`). As a result:

- `node_modules` does **not** exist and there is **no lockfile**.
- Nothing was built, type-checked, or linted here.
- Every file is hand-written so the project is correct the moment you have a
  registry available.

To run it locally you must first install dependencies:

```sh
npm install
npm run dev
```

`npm install` requires network access to the npm registry.

## Tech stack

- **React 18** (`react`, `react-dom`) — the only runtime dependencies
- **TypeScript 5** (strict mode)
- **Vite 5** with `@vitejs/plugin-react`

## Getting started (requires network access)

```sh
npm install        # install dependencies (needs registry access)
npm run dev        # start the Vite dev server
npm run build      # tsc --noEmit + vite build
npm run preview    # preview the production build
```

## Project structure

```
hello-daryl/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx            # React 18 entry (createRoot)
    ├── App.tsx             # landing screen
    ├── App.css
    ├── vite-env.d.ts
    ├── components/         # design-system components (+ barrel index.ts)
    │   ├── Button.tsx / Button.css
    │   ├── Card.tsx   / Card.css
    │   ├── Badge.tsx  / Badge.css
    │   └── Stack.tsx  / Stack.css
    ├── hooks/
    │   └── useTheme.ts     # light/dark theme with localStorage persistence
    └── styles/
        ├── tokens.css      # design tokens (CSS custom properties)
        └── global.css      # reset + base element styles
```

## Design system

The token system is layered:

1. **Raw ramps** — a neutral ramp (8 shades) and an accent ramp (4 shades),
   plus theme-independent scales: a modular type scale, a spacing scale, border
   radii, shadows, transition durations/easings, and font stacks. These live on
   `:root` in `src/styles/tokens.css`.
2. **Semantic aliases** — `--surface`, `--surface-raised`, `--text`,
   `--text-muted`, `--border`, `--accent`, `--accent-contrast`, and the shadow
   tokens. Components consume **only** these semantic aliases (and the ramps for
   badge backgrounds), never hard-coded colours.
3. **Theming** — light is the `:root` default. Dark mode is provided two ways:
   - `@media (prefers-color-scheme: dark)` follows the OS preference when the
     user has not made an explicit choice.
   - `[data-theme="light"]` / `[data-theme="dark"]` override the OS preference
     when the user toggles.

The `useTheme` hook (`src/hooks/useTheme.ts`) reads the OS preference via
`matchMedia`, lets the user toggle light/dark, writes the choice to
`document.documentElement`'s `data-theme` attribute, and persists it to
`localStorage` under the key **`hello-daryl-theme`**.

## Components

All components live in `src/components/` and are re-exported from
`src/components/index.ts`.

| Component | Props |
| --- | --- |
| **Button** | `variant?: 'primary' \| 'secondary' \| 'ghost'` (default `'primary'`), `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `disabled?: boolean` (default `false`), `onClick?: (event) => void`, `aria-label?: string`, `children` |
| **Card** | `children`, `className?: string` |
| **Badge** | `children`, `variant?: 'neutral' \| 'accent'` (default `'neutral'`) |
| **Stack** | `direction?: 'row' \| 'column'` (default `'column'`), `gap?: 1 \| 2 \| 3 \| 4 \| 6 \| 8 \| 12` (default `4`), `children`, `className?: string` |

Each component ships its own token-only CSS file, imported at the top of the
component module.
