# AI Workflow Project

Build, orchestrate, and test AI workflows with a Next.js + React Flow canvas and an extensible Agent Framework. Includes Magentic multi-agent orchestration, a rich UI component set (AI Elements), and first-class developer tooling.

## Requirements

- `node >= 18.18`
- `pnpm >= 9`

## Quick Start

- Install deps: `pnpm setup`
- Environment check: `pnpm env:check` (reads `.env.local` if present)
- Start dev server: `pnpm dev`

## Scripts

- `pnpm dev` — start Next.js dev server
- `pnpm build` — compile production build
- `pnpm start:prod` — run built app on `:3000`
- `pnpm verify` — lint, typecheck, and run tests
- `pnpm doctor` — lint + typecheck + tests in one
- `pnpm lint` / `pnpm lint:fix` — static analysis (errors only) / autofix
- `pnpm format` — Prettier format repository
- `pnpm typecheck` — TypeScript `--noEmit`
- `pnpm deps:unused` — find unused dependencies
- Cleaning: `pnpm clean`, `pnpm clean:deps`, `pnpm clean:logs`
- Docs helper: `pnpm docs:generate`

## Features

- Visual workflow builder with node library, edge groups, and unified bottom controls
- Magentic orchestrator and agent presets for multi-agent workflows
- AI Elements UI components for conversation, tooling, and canvas
- Tailwind CSS 4 and theming; accessibility-focused controls
- Vitest-based testing with UI runner; ESLint and Prettier integrations

## React Flow Setup

- Install: `pnpm add @xyflow/react`
- Import stylesheet before any UI CSS:
  ```ts
  import '@xyflow/react/dist/style.css'
  ```
- Canvas behaviors:
  - Drag to pan with middle/right button: `app/page.tsx:932-933`
  - Lock-aware node dragging: `app/page.tsx:933`
  - Auto-fit view via bottom controls: `app/page.tsx:1025-1032`
- Docs: https://reactflow.dev/learn and https://reactflow.dev/ui

## Workflow Builder

- Node Library categories and items: `components/workflow-builder/node-library.tsx`
- Bottom Controls (Undo/Redo/Fit/Lock/Theme): `components/workflow-builder/bottom-controls.tsx`
- Properties Panel and Editors
  - Generic Agent editor: `components/workflow-builder/executor-editors/agent-executor-editor.tsx`
  - Magentic Agent editor: `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx`
  - Orchestrator editor: `components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor.tsx`

## Agents

- Comprehensive agent documentation and examples live in `[AGENTS.md](./AGENTS.md)`.

## AI Elements

Available components:

- artifact, canvas, chain-of-thought, checkpoint, code-block, confirmation, connection, context, controls, conversation, edge, image, inline-citation, loader, message, model-selector, node, open-in-chat, panel, plan, prompt-input, queue, reasoning, shimmer, sources, suggestion, task, tool, toolbar, web-preview

## Testing

- Config: `vitest.config.ts:5-11` (jsdom, globals, setup `test/setup.ts`)
- Commands: `pnpm test`, `pnpm test:run`, `pnpm test:ui`

## Lint, Format, Typecheck

- ESLint config: `eslint.config.mjs:1-18`
- Format: `pnpm format`
- Typecheck: `pnpm typecheck`

## Production & Caching

- Caching headers and console removal configured in `next.config.ts:3-25`
  - `compiler.removeConsole` in production
  - Long-lived static cache and short-lived page cache via `headers()`
- Image formats: AVIF/WebP enabled

## Toolbar Integration

- Kokonut UI Toolbar: `components/kokonutui/toolbar.tsx`
- Props:
  - `onItemSelect?: (id) => void` — item id callback (`select`, `move`, …)
  - `visibleItems?: string[]` — control which items render
  - `filterDeprecated?: boolean` — hide non-functional items by default
- Deprecated items hidden by default: `shapes`, `layers`, `frame`, `properties`, `export`, `share`, `notifications`, `profile`, `appearance`

## Notes

- Tailwind CSS 4 via `postcss.config.mjs:1-7`
- Keep external API keys out of the repo; use `.env.local`
