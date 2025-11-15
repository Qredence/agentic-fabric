# Agentic Fabric

<p align="center">
  <img
    src="public/logo-darkmode.svg"
    alt="Agentic Fabric logo"
    width="72"
    style="max-width: 72px; height: auto; margin-top: 0.5rem; margin-bottom: 0.5rem;"
  />
</p>

<p align="center">
  <span style="font-size: 1.15rem; font-weight: 600;">
    Visual canvas for building, orchestrating, and testing AI workflows.
  </span>
  <br />
  <a
    href="https://agenticfabric.com"
    style="
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.55rem 1.3rem;
      border-radius: 9999px;
      background: #ffffff;
      color: #000000;
      border: 1px solid #e5e7eb;
      text-decoration: none;
      font-weight: 600;
    "
  >
    Try it online →
  </a>
</p>

> [!CAUTION]
> **Alpha software.** Agentic Fabric is under active development. APIs, workflows, and UI behaviors may change without notice and are not yet stable for long‑term production use.

Agentic Fabric lets you build, orchestrate, and test AI workflows with a visual Next.js + React Flow canvas and an extensible Agent Framework. The project bundles Magentic multi‑agent orchestration, a rich AI Elements component library, and a batteries‑included developer experience.

Use it to:

- Sketch and run complex, tool‑using agent workflows.
- Experiment with Magentic orchestration strategies and presets.
- Build custom workflow editors or AI‑powered applications on top of a well‑structured foundation.

---

## Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Core Features](#core-features)
- [Scripts](#scripts)
- [Workflow Builder & React Flow](#workflow-builder--react-flow)
- [Testing & Quality](#testing--quality)
- [Toolbar Integration](#toolbar-integration)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Notes](#notes)

---

## Requirements

- `node >= 18.18`
- `pnpm >= 9`

You can confirm your versions with:

```bash
pnpm -v
node -v
```

---

## Quick Start

From the repo root:

1. Install dependencies:

   ```bash
   pnpm setup
   ```

2. (Optional) Run the environment check:

   ```bash
   pnpm env:check
   ```

   This reads `.env.local` (if present) and validates common pitfalls.

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app should be available at `http://localhost:3000`.

---

## Core Features

- **Visual workflow builder**
  - Node library, edge groups, and unified bottom controls for building flows quickly.
  - Powered by React Flow and tailored for AI/agent use‑cases.
- **Magentic multi‑agent orchestration**
  - Orchestrator and agent presets for planner/web/coder/critic style workflows.
  - Round‑trip conversions between canvas and runtime representations.
- **Agents as first‑class citizens**
  - Strongly‑typed agent protocol and executors.
  - Workflow agents and chat agents share a unified configuration surface.
  - See `AGENTS.md` for a deeper, implementation‑focused guide.
- **AI Elements component library**
  - Conversation, messages, tools, chain‑of‑thought, web preview, and more.
  - Designed for accessibility and theming (dark/light, Tailwind CSS 4).
- **DX and quality tooling**
  - Vitest + jsdom test setup (with UI runner).
  - ESLint, Prettier, TypeScript type‑checking, and helper scripts for cleaning and docs.

---

## Scripts

Common scripts from `package.json`:

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Start the Next.js dev server. |
| `pnpm build` | Compile a production build. |
| `pnpm start:prod` | Run the compiled app on port `3000`. |
| `pnpm verify` | Lint, typecheck, and run tests. |
| `pnpm doctor` | “All‑in‑one” check (lint + typecheck + tests). |
| `pnpm lint` / `pnpm lint:fix` | Static analysis (errors only) / autofix. |
| `pnpm format` | Format the repository with Prettier. |
| `pnpm typecheck` | Run TypeScript type‑checking (`--noEmit`). |
| `pnpm deps:unused` | Report unused dependencies. |
| `pnpm clean`, `pnpm clean:deps`, `pnpm clean:logs` | Clean artifacts, dependencies, and logs. |
| `pnpm docs:generate` | Regenerate docs from source. |

---

## Workflow Builder & React Flow

This project uses React Flow as the underlying canvas.

- React Flow install (if integrating elsewhere):

  ```bash
  pnpm add @xyflow/react
  ```

- Import its stylesheet before other UI CSS:

  ```ts
  import '@xyflow/react/dist/style.css'
  ```

- Canvas behaviors and interactions:
  - Drag to pan with the middle/right mouse button: `app/page.tsx:932-933`
  - Lock‑aware node dragging: `app/page.tsx:933`
  - Auto‑fit view via bottom controls: `app/page.tsx:1025-1032`

Key workflow‑builder files:

- Node Library (categories and items): `components/workflow-builder/node-library.tsx`
- Bottom Controls (Undo/Redo/Fit/Lock/Theme): `components/workflow-builder/bottom-controls.tsx`
- Properties Panel and Editors:
  - Generic Agent editor: `components/workflow-builder/executor-editors/agent-executor-editor.tsx`
  - Magentic Agent editor: `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx`
  - Magentic Orchestrator editor: `components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor.tsx`

For deeper React Flow documentation, see the official guides:

- https://reactflow.dev/learn  
- https://reactflow.dev/ui

## Testing & Quality

Testing is powered by Vitest:

- Config: `vitest.config.ts:5-11` (jsdom, globals, setup via `test/setup.ts`).

Common commands:

- `pnpm test` — run the test suite.
- `pnpm test:run` — run tests once (no watch).
- `pnpm test:ui` — use the Vitest UI runner.

Linting, formatting, and type‑checking:

- ESLint config: `eslint.config.mjs:1-18`
- Format: `pnpm format`
- Typecheck: `pnpm typecheck`

For a full project check, run:

```bash
pnpm verify
```

> [!TIP]
> Run `pnpm verify` before opening a pull request to catch lint, type, and test issues in one go.

---

## Toolbar Integration

The Kokonut UI Toolbar powers the main toolbar experience:

- Component: `components/kokonutui/toolbar.tsx`
- Key props:
  - `onItemSelect?: (id) => void` — item selection callback (`select`, `move`, …).
  - `visibleItems?: string[]` — control which items render.
  - `filterDeprecated?: boolean` — hide non‑functional items by default.

Deprecated items (hidden by default) include: `shapes`, `layers`, `frame`, `properties`, `export`, `share`, `notifications`, `profile`, `appearance`.

---

## Contributing

Contributions are very welcome—whether it’s improving docs, adding tests, refining AI Elements, or extending agent workflows.

Please read `CONTRIBUTING.md` for:

- Setup and development workflow.
- Coding standards and testing expectations.
- Pull request guidelines.

Also see `CODE_OF_CONDUCT.md` and `SECURITY.md` for participation and security reporting guidelines.

---

## Acknowledgements

Agentic Fabric builds on the work of several excellent open‑source projects:

- **Agent Framework** — orchestration patterns and abstractions inspired by [`microsoft/agent-framework`](https://github.com/microsoft/agent-framework).
- **React Flow** — the underlying canvas and node/edge system that powers the visual workflow builder, via [`xyflow/xyflow`](https://github.com/xyflow/xyflow).
- **DSPy** — ideas around declarative, optimizer‑driven AI workflows informed parts of the design, inspired by [`stanfordnlp/dspy`](https://github.com/stanfordnlp/dspy).

---

## Notes

- Tailwind CSS 4 is configured via `postcss.config.mjs`.
- Keep external API keys out of the repository; use `.env.local` for secrets and environment‑specific values.
