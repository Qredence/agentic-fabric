# AI Coding Agent Instructions for `ai-workflow`

Concise, project-specific guidance to be productive quickly.

## Overview & Architecture

- Framework: Next.js 16 (App Router) + React 19, TypeScript, Tailwind CSS v4 (utility classes) + Radix UI primitives + class-variance-authority (CVA) for variant-driven styling.
- UI organized under `components/ui` (generic primitives) and `components/ai-elements` (chat/workflow specific components). `lib/utils.ts` exports `cn()` for class merging.
- State patterns: Many AI components expose dual-mode operation (self-managed vs externally provided via optional context providers). Example: `PromptInput` can manage its own attachments/text or consume context from `PromptInputProvider`.
- Styling pattern: Compose base Tailwind utility strings + CVA variants (e.g., `button.tsx`, `message.tsx`). Prefer extending existing CVA definitions instead of ad-hoc class names when adding variants.

## Key Conventions

- Use `cn()` instead of manual concatenation for classes; always pass arrays or conditional values rather than building strings manually.
- Variant props: Extend existing `cva` config; never duplicate variant logic in downstream components.
- Chat/message layout uses structural class hooks like `.is-user` / `.is-assistant` applied to parent `Message` wrapper; descendant selectors in variants rely on `group-[.is-user]` etc. Preserve these when refactoring.
- Attachments use blob URLs which must be revoked to avoid leaks. Follow existing cleanup patterns (`URL.revokeObjectURL`) on removal/unmount.
- Components prefixed `PromptInput*` form a composable namespace; do not cross-import internal context symbols outside this file—add new subcomponents here for cohesion.

## Adding Features

- For new interactive chat actions: Add a focused component to `components/ai-elements/` and leverage existing context hooks (e.g., `usePromptInputController`). If global state needed, extend provider value rather than introducing new global singletons.
- For additional button styles or sizes: Modify `buttonVariants` in `components/ui/button.tsx`; add new `variant` or `size` entries; keep accessibility/focus classes.
- For new message presentation variants: Extend `messageContentVariants` in `message.tsx`; maintain defaultVariants and group selectors.

## Morphing Node Components (TextBlockCard & AttributeNode)

- `text-block-card.tsx` and `attribute-node.tsx` provide animated, collapsible node UI components (352×352px cards) for workflow/graph interfaces.
- Both use `motion/react` (not `framer-motion`) for spring animations with collapse/expand morphing; include `ConnectionHandle` sub-components for graph edges.
- Fixed styling with dark translucent backgrounds (`rgba(32,32,32,0.9)`); styled inline with Tailwind v4 classes—no CVA variants or `cn()` usage.
- Self-managed state (hover, collapse) with optional external control via props (`isSelected`, `isHovered`, `collapsed`, `onToggleCollapse`).
- `TextBlockCard`: Text editor with suggestions panel, shimmer placeholder animation, dual textarea setup (main + bottom input).
- `AttributeNode`: Configurable parameter controls (input, slider, checkbox, select, progress) with `onAttributeChange` callback.
- Import: `import { TextBlockCard } from "@/components/ai-elements/text-block-card"` and `import { AttributeNode } from "@/components/ai-elements/attribute-node"`.
- When extending: preserve spring transition configs with `as const` type annotation for TypeScript compatibility.

## Typical Data Flow (PromptInput)

1. User types text (`PromptInputTextarea`) – optionally controlled via provider.
2. Files added (clipboard paste, drag & drop, file dialog) become `FileUIPart` entries with blob URLs.
3. On submit, blob URLs converted to data URLs asynchronously before invoking `onSubmit`.
4. Attachments cleared only on successful (or synchronous) completion; errors retain state for retry.

## Performance & Memory Notes

- Avoid large prolonged blob URL lists; reuse cleanup logic shown in `PromptInput` (revoking in `remove`, `clear`, and effect cleanup).
- When adding components with heavy rendering, prefer memoization (`useMemo`) and keep prop objects stable.

## Build & Scripts

- Development: `npm run dev` (or `bun dev` etc.). Production build: `npm run build` then `npm start`.
- Lint: `npm run lint` uses ESLint 9 + `eslint-config-next` (App Router). Ensure new files follow existing import alias (`@/`).

## Import & Path Strategy

- Use absolute alias `@/` for root (configured by Next.js/tsconfig). Examples: `import { cn } from "@/lib/utils";`.
- Keep library-agnostic utilities in `lib/`; UI primitives in `components/ui`; AI workflow-specific pieces in `components/ai-elements`.

## Tailwind & Theming

- Tailwind v4 utilities; prefer semantic tokens (`bg-primary`, `text-muted-foreground`) rather than raw colors for consistency.
- When introducing new style states, follow pattern using `group` or aria/state attributes (e.g., `focus-visible`, `aria-invalid`).

## Testing & Validation (Future)

- No test suite present; if adding tests, colocate with component (`__tests__` or `.test.tsx`) and assert provider vs local modes behave identically.

## Dos & Don'ts

- DO extend provider context carefully; keep backward compatibility for self-managed mode.
- DO maintain accessibility: preserve `aria-label`, `sr-only` spans, focus ring classes.
- DO revoke object URLs on any path that removes attachments.
- DON'T introduce duplicate context providers for the same concern; augment existing.
- DON'T hardcode model-specific logic into UI components; keep them presentation/state only.

## Example Pattern

Add a new attachment action:

```tsx
// Inside prompt-input.tsx
export const PromptInputActionAddAudio = (props: ComponentProps<typeof DropdownMenuItem>) => {
  const attachments = usePromptInputAttachments();
  return (
    <DropdownMenuItem
      {...props}
      onSelect={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      <MicIcon className="mr-2 size-4" /> Add audio
    </DropdownMenuItem>
  );
};
```

Refactor with minimal duplication: add variant in CVA config instead of conditional class inside render.

---

If any architectural assumptions here are outdated (e.g., introducing server actions, RSC data loaders, vector search, etc.) please clarify for refinement.
