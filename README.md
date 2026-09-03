# kiro-sandbox

## Hello Daryl app

A small React 18 + TypeScript landing screen showcasing a hand-rolled,
token-based design system lives in [`./hello-daryl/`](./hello-daryl/) — see its
own [README](./hello-daryl/README.md) for details.

> Note: dependencies were not installed in the authoring sandbox because the npm
> registry was unreachable. Run `npm install` then `npm run dev` inside
> `hello-daryl/` locally (requires network access).


## Continuous integration

Because the authoring sandbox has no npm registry access, the app is built and
verified on GitHub Actions instead:

- **CI** (`.github/workflows/ci.yml`) — installs dependencies and runs the
  TypeScript build and the Vitest suite on Node 18.x and 20.x for every push and
  pull request.
- **Screenshots** (`.github/workflows/screenshots.yml`) — builds the production
  bundle, serves it, drives it with Playwright/Chromium, and commits real
  screenshots of the splash and landing screens (light/dark, desktop/mobile)
  into [`hello-daryl/docs/screenshots/`](./hello-daryl/docs/screenshots/).
