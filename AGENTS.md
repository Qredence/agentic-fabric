# Repository Guidelines

## Project Structure & Module Organization
The app uses the Next.js App Router. `app/` hosts route entries (`layout.tsx`, `page.tsx`) and global CSS. Shared UI elements live in `components/`, split between `ai-elements/`, `ui/`, and `workflow-builder/` for canvas tooling. Core business logic is in `lib/`, particularly `lib/workflow/` which contains domain models, executors, and a dedicated `__tests__/` suite; keep cross-cutting helpers in `lib/utils.ts`. Static assets belong in `public/`, and test harness files sit in `test/` (e.g. `test/setup.ts`). Import root-level modules via the `@/` alias configured in Vite and Next.

## Build, Test, and Development Commands
- `npm run dev` – start the Next.js dev server at http://localhost:3000 with hot reload and type checking.
- `npm run build` – compile the production bundle; run before tagging releases to surface route and type errors.
- `npm run start` – serve the built output locally for smoke testing.
- `npm run lint` – execute ESLint with the Next.js core-web-vitals rules; fix all warnings before opening a PR.
- `npm run test` / `npm run test:run` – run Vitest with jsdom; use `test:run` for CI and `test:ui` when debugging interactively.

## Coding Style & Naming Conventions
Write TypeScript-first React 19 components using functional patterns and hooks. Follow ESLint auto-fixes (2-space indentation, single quotes in JSX per project defaults). Use PascalCase for React components, camelCase for hooks and utilities, and SCREAMING_SNAKE_CASE for constants. Co-locate canvas-specific logic inside `components/workflow-builder/`, but place pure business logic in `lib/workflow/`. Favor Tailwind utility classes within components; extend shared tokens in `app/globals.css`.

## Testing Guidelines
Vitest with React Testing Library is the default. Organize unit specs beside the code when feasible (`lib/workflow/__tests__/conversion.test.ts` shows the pattern) and suffix files with `.test.ts`. Ensure new workflow behaviors include scenario coverage and assertion helpers from `test/setup.ts`. Aim to keep coverage steady by pairing new features with regression tests and add integration suites for multi-node flows.

## Commit & Pull Request Guidelines
Commit messages follow Conventional Commits (`feat:`, `fix:`, etc.); scope components when helpful (e.g., `feat(workflow): add edge validation`). Each PR should include: a concise summary, linked issue or ticket, screenshots/GIFs for UI changes, and a checklist of commands run (`lint`, `test`). Keep diffs focused; extract refactors into separate commits when possible.
