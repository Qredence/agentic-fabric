# AI Workflow Project

## Setup
- Requirements: `node >= 18.18`, `pnpm >= 9`
- Install: `pnpm setup`
- Environment check: `pnpm env:check` (uses `.env.local` if present)
- Scripts location: `package.json:5-13` plus new entries

## Clean
- Remove build artifacts and caches: `pnpm clean`
- Reset dependencies: `pnpm clean:deps` then `pnpm setup`
- Clear logs: `pnpm clean:logs`

## Optimize
- Lint fix: `pnpm lint:fix`
- Format: `pnpm format`
- Typecheck: `pnpm typecheck`
- Find unused dependencies: `pnpm deps:unused`
- Production config: see `next.config.mjs:1-33` for minification, console removal, images, and caching headers

## Build
- Verify: `pnpm verify` (lint + typecheck + tests)
- Build: `pnpm build`
- CI build: `pnpm build:ci`
- Start production: `pnpm start:prod`

## React Flow
- Install: `npm install @xyflow/react`
- Import stylesheet before shadcn UI CSS: `import '@xyflow/react/dist/style.css'`
- Docs: https://reactflow.dev/learn and https://reactflow.dev/ui

## AI Elements
- Available components:
  - artifact
  - canvas
  - chain-of-thought
  - checkpoint
  - code-block
  - confirmation
  - connection
  - context
  - controls
  - conversation
  - edge
  - image
  - inline-citation
  - loader
  - message
  - model-selector
  - node
  - open-in-chat
  - panel
  - plan
  - prompt-input
  - queue
  - reasoning
  - shimmer
  - sources
  - suggestion
  - task
  - tool
  - toolbar
  - web-preview

## Testing
- Vitest config: `vitest.config.ts:5-11` with setup file `test/setup.ts`
- Commands: `pnpm test`, `pnpm test:run`, `pnpm test:ui`

## Notes
- Caching headers configured via `headers()` in `next.config.mjs`
- ESLint config: `eslint.config.mjs:1-18`
- Tailwind CSS 4 via `postcss.config.mjs:1-7`

## Toolbar Integration
- Kokonut UI Toolbar: `components/kokonutui/toolbar.tsx`
  - Props:
    - `onItemSelect?: (id) => void` — receives item id (e.g., `select`, `move`)
    - `visibleItems?: string[]` — control which items render (e.g., `["select","move"]`)
    - `filterDeprecated?: boolean` — when true, hides non-functional items by default
  - Deprecated items hidden by default: `shapes`, `layers`, `frame`, `properties`, `export`, `share`, `notifications`, `profile`, `appearance`
- Unified bottom controls provide Undo, Redo, Auto-fit view, and Lock toggle: `components/workflow-builder/bottom-controls.tsx:31-81`
- Unified mode behavior in canvas:
  - `panOnDrag` uses right/middle buttons: configured in `app/page.tsx:1047-1050`
  - `nodesDraggable` disabled when locked; selection remains enabled: `app/page.tsx:1047-1050`
  - `onFitView` triggers `reactFlow.fitView()`: `app/page.tsx:1130-1136`
