# Contributing Guide

Thank you for your interest in contributing to this project!  
This guide walks you through how to get set up, make changes, and submit improvements in a way that keeps the experience smooth for everyone.

## Code of Conduct

By participating in this project, you agree to follow the guidelines in `CODE_OF_CONDUCT.md`.

If you experience or observe unacceptable behavior, please follow the reporting instructions in that file.

## Project Overview

This repository is a Next.js + React Flow based canvas for designing, running, and testing AI workflows on top of an Agent Framework and Magentic multi‑agent orchestration.

For a high‑level introduction, start with:

- `README.md` — quick start, scripts, and feature overview.
- `AGENTS.md` — deeper dive into agents, executors, and Magentic workflows.

## Getting Started

### Prerequisites

- `node >= 18.18`
- `pnpm >= 9`

You can verify your setup with:

```bash
pnpm -v
node -v
```

### Install Dependencies

From the repo root:

```bash
pnpm setup
```

This will install dependencies and perform any initial project setup.

### Run the Dev Server

Start the Next.js development server:

```bash
pnpm dev
```

By default, the app runs on `http://localhost:3000`.

## Development Workflow

### Branching

- Create a feature branch from `main` for your work.
- Use a descriptive name, for example:
  - `feature/add-agent-preset`
  - `fix/toolbar-accessibility`
  - `docs/update-agents-guide`

### Coding Standards

- Use TypeScript for application code.
- Prefer existing patterns and abstractions in:
  - `components/ai-elements` for AI UI building blocks.
  - `components/workflow-builder` for canvas and workflow editors.
  - `lib/workflow` for protocol, executors, tools, and conversions.
- Keep changes focused and small where possible; separate unrelated updates into different pull requests.

### Linting, Formatting, and Type Checking

Before opening a pull request, please run:

```bash
pnpm lint
pnpm typecheck
pnpm format
```

You can also run the full verification suite:

```bash
pnpm verify
```

This will lint, typecheck, and run tests.

## Testing

The project uses Vitest for testing.

Common commands:

- Run the test suite:

  ```bash
  pnpm test
  ```

- Run tests once (no watch):

  ```bash
  pnpm test:run
  ```

- Use the UI runner:

  ```bash
  pnpm test:ui
  ```

Please include or update tests when:

- Adding new functionality.
- Changing behavior of existing components, workflows, or tools.
- Fixing a bug.

## Making Changes

When implementing changes:

- Prefer reusing existing components and utilities.
- Keep agent‑related changes aligned with the structures described in `AGENTS.md`.
- Update documentation if you change or add:
  - Agent behaviors or presets.
  - Workflow nodes, executors, or tooling.
  - Public APIs or configuration options.

For user‑facing behavior, consider:

- Accessibility (keyboard navigation, contrast, ARIA where appropriate).
- Clear copy, error messages, and labels.

## Submitting a Pull Request

When you are ready to open a pull request:

1. Ensure your branch is up to date with `main`.
2. Confirm that:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test` (or `pnpm verify`)
   all succeed.
3. Open a PR and include:
   - A short summary of the change.
   - Any screenshots or recordings for UI changes.
   - Notes on how to test or reproduce the behavior.

Smaller, well‑scoped PRs are easier to review and ship quickly.

## Security and Responsible Disclosure

If you discover a security issue, **do not** open a public issue or PR.  
Instead, follow the instructions in `SECURITY.md` for responsible disclosure.

## Questions and Help

If you are unsure about something or want feedback before investing significant effort:

- Open a draft PR with a brief description, or
- Start with a small documentation or test change to validate your approach.

We appreciate every contribution—whether it’s fixing a typo, improving docs, adding tests, or designing new workflows and agents. Thank you for helping improve this project!

