## Overview
- Automate setup, cleaning, optimization, and build for the existing Next.js (React 19) app using `pnpm` scripts and small utility scripts.
- Add system requirement checks, environment validation, robust error handling, and CI-friendly verification.
- Generate documentation sections for React Flow and AI Elements and place them into the README.

## Current Repo Highlights
- Package manager: `pnpm`; scripts in `package.json` lines 5–13 (`package.json:5-13`).
- Build system: Next.js with TypeScript; configs: `next.config.mjs:1-11`, `next.config.ts:1-7`, `tsconfig.json:1-27`.
- Testing: Vitest with JSDOM (`vitest.config.ts:5-11`) referencing a missing `./test/setup.ts` (`vitest.config.ts:10`).
- ESLint: `eslint.config.mjs:1-18` (Next core web vitals).
- Tailwind CSS 4 via PostCSS: `postcss.config.mjs:1-7`.
- React Flow already installed (`package.json:34`) and used across UI components; logging gated by env in `components/ai-elements/prompt-input.tsx:1109`.

## Assumptions
- Node ≥ 18.18 (prefer ≥ 20), `pnpm` ≥ 9.
- Primary automation entry point is `package.json` scripts; optional helper TS/JS scripts under `scripts/`.
- Keep a single `next.config` (TS or MJS) to avoid ambiguity.

## Step 1: Setup
- Add scripts:
  - `setup`: install deps, verify versions, create `.env.local` from `.env.example` if missing.
    - Commands: `pnpm install`, `node -v`, `pnpm -v`.
  - `doctor`: run `lint`, `typecheck`, `test:run` to validate local env.
  - `env:check`: ensure required env keys exist; show clear errors if missing.
- Add `engines` in `package.json` and optional `volta` pinning to prevent version drift.
- Create `.env.example` with baseline keys (e.g., `NEXT_PUBLIC_APP_NAME`, `NEXT_TELEMETRY_DISABLED=1`).
- Consolidate `next.config` into one file and enable safe production defaults (see Optimize).

## Step 2: Clean
- Add scripts:
  - `clean`: remove `.next`, `out`, `build`, `coverage`, caches; delete macOS `.DS_Store`; prune pnpm store.
    - Commands: `pnpm dlx rimraf .next out build coverage`, `pnpm store prune`, `git clean -fdX` (optional, documented as destructive).
  - `clean:deps`: remove `node_modules` and lockfile, reinstall.
    - Commands: `pnpm dlx rimraf node_modules`, `rm -f pnpm-lock.yaml`, `pnpm install`.
  - `clean:logs`: remove local log files under `./logs/**` if present.
- Use `set -e` style behavior via Node TS script wrappers for cross-platform reliability.

## Step 3: Optimize
- Code quality:
  - `lint:fix`: `eslint --fix`.
  - `format`: `prettier --write .` (via `pnpm dlx prettier`).
  - `typecheck`: `tsc --noEmit`.
  - `deps:unused`: `pnpm dlx depcheck` and report unused deps; propose removal.
- Build optimization (Next):
  - In `next.config`: enable `swcMinify: true`, set `compiler.removeConsole` for production, consider `modularizeImports` for large libs (`lucide-react`), and configure `images` properly (remove `unoptimized: true` for production unless required).
  - HTTP caching headers via `headers()`:
    - Static assets: `Cache-Control: public, max-age=31536000, immutable`.
    - App data/pages: `Cache-Control: public, max-age=60, stale-while-revalidate=600`.
  - Bundle analysis: add `@next/bundle-analyzer` and `build:analyze`.
- Resource loading best practices:
  - Use `next/font` for fonts, `next/script` with `strategy` for third-party scripts, dynamic imports for heavy components, and `Image` for images.
- React Flow prerequisites (from docs):
  - Ensure `@xyflow/react` is installed (`package.json:34`).
  - Import stylesheet before shadcn UI CSS: `import '@xyflow/react/dist/style.css';` (see docs: React Flow UI Components updated to React 19 and Tailwind CSS 4).

## Step 4: Build
- Add scripts:
  - `verify`: `lint`, `typecheck`, `test:run` sequentially.
  - `build`: `next build` (already present).
  - `build:ci`: run `verify` then `next build` with `NODE_ENV=production`.
  - `start:prod`: `next start -p 3000`.
- Tests:
  - Fix missing setup file reference (`vitest.config.ts:10`) by adding `test/setup.ts` or removing the entry.
  - Enable coverage: `vitest run --coverage`.

## Documentation (README)
- Add sections:
  - Setup: system requirements, `pnpm i`, `env:check`, `setup`.
  - Clean: explain `clean`, `clean:deps`, `clean:logs`.
  - Optimize: lint/format/typecheck, depcheck, Next build optimizations, caching headers.
  - Build: `verify`, `build`, `build:ci`, `start:prod`.
  - React Flow quickstart and styling order:
    - `npm install @xyflow/react`
    - `import '@xyflow/react/dist/style.css'` before shadcn UI CSS.
  - AI Elements components catalog (auto-generated list).

## Docs Generation
- Generate AI Elements list from the available component catalog and embed into README:
  - Components: [artifact, canvas, chain-of-thought, checkpoint, code-block, confirmation, connection, context, controls, conversation, edge, image, inline-citation, loader, message, model-selector, node, open-in-chat, panel, plan, prompt-input, queue, reasoning, shimmer, sources, suggestion, task, tool, toolbar, web-preview].
- Include React Flow references/links for installation and usage (as per provided docs).

## Error Handling
- Wrap complex operations in Node TS scripts (`scripts/`) with structured try/catch, clear exit codes, and actionable messages.
- Always halt on first failure for `setup`, `clean`, `verify`, and `build:ci`.

## CI/CD (Optional)
- Add `.github/workflows/ci.yml` to run: `pnpm install`, `pnpm verify`, `pnpm build`, and cache pnpm store.

## Deliverables
- Updated `package.json` with new scripts.
- Single authoritative `next.config` with production-safe defaults.
- `scripts/` utilities for env check, clean, docs generation.
- README sections for each step + React Flow + AI Elements docs.
- Vitest setup file or config correction; coverage enabled.

## Verification
- Local: `pnpm setup` → `pnpm verify` → `pnpm build` → `pnpm start`.
- CI: green pipeline on lint, typecheck, tests, and build.

## Next Steps
- Confirm this plan to proceed with implementing scripts, configs, and README updates, then run `verify` and demonstrate a clean build.