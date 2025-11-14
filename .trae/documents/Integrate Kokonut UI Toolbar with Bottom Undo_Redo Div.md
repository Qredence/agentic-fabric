## Objective
- Integrate `components/kokonutui/toolbar.tsx` into the bottom toolbar div, preserving Undo/Redo and adding Kokonut UI features.

## Changes Overview
- Extend the Kokonut Toolbar to expose an integration hook.
- Compose the Kokonut Toolbar alongside existing Undo/Redo buttons within `BottomControls`.
- Map Kokonut interactions (Select, Move) to existing pointer/pan behavior.
- Keep styling consistent with the design system and ensure accessibility and error handling.

## File Updates
1. `components/kokonutui/toolbar.tsx`
- Add a new optional prop: `onItemSelect?: (id: string) => void`.
- Call `onItemSelect(itemId)` inside `handleItemClick` after updating component state.
- No visual changes; preserve existing animations and styles.

2. `components/workflow-builder/bottom-controls.tsx`
- Import `Toolbar` from `components/kokonutui/toolbar`.
- Add optional props to `BottomControls`:
  - `showAdvancedToolbar?: boolean` (default: true)
  - `kokonutClassName?: string`
- Render `Toolbar` next to Undo/Redo when `showAdvancedToolbar` is true.
- Implement `handleKokonutSelect(id)`:
  - `select` → `onToolChange?.('pointer')`
  - `move` → `onToolChange?.('pan')`
  - Others: no-op (still show Kokonut notifications).
- Preserve Undo/Redo disabled states and accessibility labels.

## Error Handling & Types
- Wrap `onUndo`/`onRedo` and `onToolChange` calls in try/catch.
- Type-check new props; keep backward compatibility for existing consumers.

## Verification
- Run `pnpm dev` and confirm:
  - Undo/Redo states update based on history.
  - Kokonut toolbar renders within the bottom div and responds to clicks.
  - Selecting “Select” or “Move” adjusts pointer/pan behavior on the canvas.
  - Focus rings and labels remain accessible; tooltips retain keyboard shortcuts.
  - Responsiveness and cross-browser behavior remain stable.

## Documentation in Response
- Document new props: `showAdvancedToolbar`, `kokonutClassName`, `onItemSelect`.
- Note interaction mapping (Select → pointer, Move → pan).

## Deliverable
- A unified, minimal bottom toolbar that preserves core Undo/Redo and integrates Kokonut UI animations/controls for select/move without reintroducing clutter.