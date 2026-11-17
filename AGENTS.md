# AGENTS.md

Instructions for coding agents working in this repository. They hold for people too.

## The project

French learning cards: a small React and TypeScript app, built with Vite, that shows French vocabulary flashcards one at a time. Every push to `main` deploys it to GitHub Pages: https://cheungyang.github.io/french-learning-cards/

## Runtime

- Node.js 22, pinned in `.nvmrc`. Switch to it before running anything: `fnm use` (or `nvm use`). CI and the deploy read the same file.
- npm, with `package-lock.json` committed. Install with `npm ci`. Run `npm install` only when you change dependencies on purpose, and commit the updated lockfile with that change.

## Commands

| What | Command |
|---|---|
| Install | `npm ci` |
| Everything CI checks | `npm run check` |
| Lint (oxlint) | `npm run lint` |
| Type-check and build | `npm run build` |
| Tests (Vitest) | `npm test` |
| Dev server | `npm run dev` |

`npm run check` is the definition of done. Run it before you change anything, so you know the starting state, and again before you finish: it must exit 0. CI runs the same command on every pull request.

## Layout

- `src/App.tsx` and `src/main.tsx`: the app shell.
- `src/components/`: React components, each with its CSS and a `*.test.tsx` beside it.
- `src/hooks/useFlashcards.ts`: the deck's state, and the `Card` type.
- `src/data/cards.json`: the cards.
- `public/`: static files, served from the site's root.

## TypeScript settings that fail the build

- `verbatimModuleSyntax`: import types as types, with `import type { Card } from '...'` or `import { useFlashcards, type Card } from '...'`.
- `noUnusedLocals` and `noUnusedParameters`: remove unused imports and variables. That includes `import React from 'react'` in a file that only uses JSX, since the JSX transform doesn't need it.

## Tests

- Vitest with Testing Library. Test files that render React, hooks included, start with `// @vitest-environment jsdom`.
- Add or update tests for any behaviour you change.

## Working rules

- Work on a branch and open a pull request. Nobody pushes to `main`: a pull request needs green CI and an approving review.
- Keep each change to what its issue asks for.
- Don't edit `.github/workflows/` unless the issue asks for it.
- The site is served under `/french-learning-cards/`, not the domain root, because the deploy builds with `--base=/french-learning-cards/`. Import assets from code, or build URLs from `import.meta.env.BASE_URL`. Don't hard-code root paths such as `/images/x.png`.
