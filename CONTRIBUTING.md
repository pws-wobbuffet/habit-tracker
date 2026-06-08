# Contributing

## Prerequisites

- [bun](https://bun.sh) 1.3+
- [pnpm](https://pnpm.io) 11+
- A modern browser (Chrome 120+ or Safari 17+)

## Local development

```sh
git clone https://github.com/pws-wobbuffet/habit-tracker
cd habit-tracker
pnpm install
bun run dev
```

The app opens at `http://localhost:5173`. Hot-reload is active.

## Running tests

```sh
bun test
```

## Lint and typecheck

```sh
bun run lint          # ESLint
bun run format        # Prettier (--check mode, no writes)
bun run typecheck     # tsc --noEmit
```

All three must pass before submitting a PR. The CI pipeline runs them automatically.

## How to open a PR

1. Fork the repo and create a branch: `git checkout -b my-feature`
2. Make your changes.
3. Run lint, format, typecheck, and tests.
4. Open a PR against `main`. Describe the change and link any related issue.
5. CI must be green before merging.

## Adding a new screen

1. Create `src/screens/<name>/<Name>Screen.tsx` following the existing pattern (Framer Motion page variant, `StatusBar` at top, scrollable content).
2. Add the route in `src/App.tsx`.
3. Add a tab in `src/components/layout/BottomNav.tsx` if it belongs in the bottom navigation.

## Editing the docs

The documentation site uses [Starlight](https://starlight.astro.build) and lives in `docs/`.

```sh
cd docs
pnpm install
pnpm dev    # starts Astro dev server at http://localhost:4321
```

Edit `.mdx` files in `docs/src/content/docs/`.
