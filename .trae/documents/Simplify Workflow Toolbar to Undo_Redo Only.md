## Objective
- Simplify the workflow bottom toolbar to show only Undo and Redo icon buttons, removing selection/pan controls and divider.

## Files to Update
- `components/workflow-builder/bottom-controls.tsx:24-89`
- No changes needed in `app/page.tsx:1111-1136` (undo/redo wiring and history are already correct).

## Changes
- Remove non-essential toolbar elements:
  - Delete the divider (`<div className="w-px h-6 bg-border mx-1" />`).
  - Delete Selection tool button (`MousePointer2`) and Pan tool button (`Hand`).
- Keep Undo and Redo buttons:
  - Preserve disabled states via `canUndo` / `canRedo`.
  - Add `aria-label="Undo"` and `aria-label="Redo"` to improve accessibility.
  - Keep `title` with shortcuts: `Undo (Ctrl+Z)`, `Redo (Ctrl+Shift+Z)`.
- Maintain design consistency:
  - Keep container classes: `flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur-sm shadow-lg p-1.5`.
  - Continue using shared `Button` and `lucide-react` icons.

## Behavior Notes
- Selection and node interactions remain unchanged.
- Panning via native gestures (wheel, trackpad, right/middle mouse) remains available even without the explicit pan toggle.
- Existing keyboard shortcuts are preserved (no changes to handlers).

## Accessibility
- Buttons remain focusable with visible focus styles.
- Clear labels (`aria-label`) and tooltips (`title`).

## Verification
- Run `pnpm dev`.
- Confirm visual states: Undo/Redo enabled/disabled based on history (`app/page.tsx:468-470`).
- Test clicking Undo/Redo updates nodes/edges.
- Validate keyboard shortcuts still work if implemented elsewhere.
- Confirm selection and drag work; pan via native gestures still functions.

## Deliverable
- Minimal, clean bottom toolbar displaying only Undo and Redo, aligned with the design system and accessibility requirements.