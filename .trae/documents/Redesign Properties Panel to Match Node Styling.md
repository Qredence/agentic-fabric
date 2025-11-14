## Goal
- Make the Properties Panel visually consistent with node components (color, typography, spacing, hierarchy, effects, interactions, accessibility) while preserving functionality and responsiveness.

## Target Components & References
- Panel wrapper: `components/ai-elements/panel.tsx:7-11`
- Properties Panel markup and styles: `components/workflow-builder/properties-panel.tsx:109-439`
- Node styling primitives: `components/ai-elements/node.tsx:21-33,37-42,60-62,66-71` and `components/ui/card.tsx:5-15,18-29,64-72,74-82`
- Button and icon styling already used in Properties Panel (consistent with nodes)

## Design Updates
1. Panel Wrapper (consistent radius, shadow, colors)
- Update default classes in `components/ai-elements/panel.tsx` to match Card/Node tokens:
  - Border radius: `rounded-md` (nodes)
  - Border: `border` with theme foreground and consistent opacity
  - Background: `bg-card` with `text-card-foreground`
  - Shadow: `shadow-sm`
  - Spacing: remove hard-coded `pt-[74px]`; use content header/footer spacing like Card
- Proposed default:
  - `className={cn("m-4 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm", className)}`

2. Properties Panel Container & Sections (hierarchy and spacing)
- Container: `mr-4 w-[min(100%,480px)] p-0 max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col`
- Scroller: `flex-1 overflow-y-auto p-4 space-y-4`
- Header: add Card-like header styles
  - `rounded-t-md border-b bg-secondary px-4 py-3`
  - Title: `text-lg font-semibold text-foreground`
  - Description: `text-sm text-muted-foreground`
- Footer: add Card-like footer styles
  - `border-t bg-secondary px-4 py-3`
- Keep existing Button, Label, Input, Select, Textarea, Switch components for consistent iconography and focus states.

3. Animations & Interactions
- Match node transitions: use consistent Tailwind utility transitions where present:
  - `transition-colors duration-200 ease-out` on interactive elements in header/footer
  - Maintain existing hover/focus styles coming from shared UI components
- Avoid introducing new animation frameworks; keep the current behavior aligned with nodes.

4. Accessibility
- Wrap panel with semantic role and labels:
  - Add `role="region"` and `aria-labelledby="panel-title-${selectedNode.id}"` to Panel element
  - Add `id` to `<h2>` and ensure contrast via theme tokens already used (`bg-card`, `text-foreground`, `text-muted-foreground`)
- Ensure buttons retain `title` attributes and are focusable; Switch and Select already include accessible roles and states.

5. Responsiveness
- Use width constraint `w-[min(100%,480px)]` and `max-h-[calc(100vh-3.5rem)]`
- Ensure internal controls wrap appropriately; typography scales consistently (Tailwind defaults)
- Test at breakpoints: mobile (375px), tablet (768px), desktop (1280px+)

## Implementation Plan (Code Changes)
1. `components/ai-elements/panel.tsx`
- Replace default class list:
```
<PanelPrimitive
  className={cn(
    "m-4 overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm",
    className
  )}
  {...props}
/>
```
2. `components/workflow-builder/properties-panel.tsx`
- Update the outer `Panel` `className` to:
  - `mr-4 w-[min(100%,480px)] p-0 max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col`
- Update header section container to:
  - `space-y-1 border-b border-border pb-4 bg-secondary rounded-t-md px-4 py-3`
- Update footer container to:
  - `border-t border-border bg-secondary px-4 py-3`
- Add `role="region"` and `aria-labelledby` attributes to `Panel` (derive id from node id)
- Ensure titles have `id` to link the `aria-labelledby`

## Testing & Verification
- Unit tests (React Testing Library):
  - Panel defaults apply `rounded-md`, `shadow-sm`, `bg-card`, and `text-card-foreground`
  - Properties Panel header/footer have border and background styles
  - ARIA attributes present (`role="region"`, `aria-labelledby`)
- Manual checks:
  - Side-by-side comparison with node cards for radius, shadows, spacing, typography
  - Cross-browser (Chromium, Firefox, WebKit)
  - Accessibility: color contrast using theme tokens; keyboard navigation through controls
  - Responsive behavior at mobile/tablet/desktop widths

## Notes on Functionality Preservation
- No changes to data update logic; all handlers (`onUpdate`, `onDelete`, `onDuplicate`, `onEvaluate`) remain unchanged.
- Shared UI primitives (Button, Label, Input, Select, Switch) already provide consistent iconography, focus, and hover states.

## Next Step
- After approval, I will implement the changes, add unit tests for the panel styles and ARIA attributes, and run verification locally (UI side-by-side and automated tests).