# Light Mode Color Palette (WCAG 2.1 AA)

## Core Colors
- Primary text: `#0F172A` (RGB 15,23,42) — role: `text-foreground`
- Background: `#F9FAFB` (RGB 249,250,251) — role: `bg-background`
- Accent (interactive):
  - Base: `#1D4ED8` (RGB 29,78,216) — role: `bg-primary`, `text-primary`
  - Hover: `#1E40AF` (RGB 30,64,175)
  - Active: `#1E3A8A` (RGB 30,58,138)
  - Focus ring: `#2563EB` (RGB 37,99,235) — role: `outline-ring`
- Secondary text: `#475569` (RGB 71,85,105) — role: `text-muted-foreground` or `text-secondary-foreground`
- Borders:
  - Subtle: `#CBD5E1` (RGB 203,213,225) — role: `border-border`
  - Strong: `#94A3B8` (RGB 148,163,184) — role: `border-border-strong`

## OKLCH Tokens (Light Mode)
- `--background: oklch(0.98 0.02 247)`
- `--foreground: oklch(0.145 0.01 250)`
- `--primary: oklch(0.17 0.14 258)`
- `--primary-foreground: oklch(0.985 0 0)`
- `--muted-foreground: oklch(0.17 0.01 250)`
- `--accent: oklch(0.96 0.03 257)`
- `--accent-foreground: oklch(0.2 0.01 250)`
- `--border: oklch(0.90 0.01 250)`
- `--border-strong: oklch(0.72 0.02 250)`
- `--ring: oklch(0.25 0.12 257)`

## Usage Guidelines
- Use `text-foreground` for body copy, titles; reserve `text-muted-foreground` for meta and helper text.
- Use `bg-primary text-primary-foreground` for primary buttons; use `text-primary` for links.
- Use `hover:bg-accent`/`hover:text-accent-foreground` for subtle hover states; avoid pure white hovers.
- Prefer `border-border` for container outlines; switch to `border-border-strong` for dividers or when separation is required.
- Ensure focus visibility with `outline-ring ring-[3px]` on interactive components.

## Contrast Targets
- Normal text vs background ≥ 4.5:1
- Large text vs background ≥ 3:1
- Non-text indicators (focus rings, UI outlines) ≥ 3:1
- Verified by tests in `app/__tests__/color-contrast.test.ts`