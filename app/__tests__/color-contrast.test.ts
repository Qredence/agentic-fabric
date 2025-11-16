import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function parseOKLCH(value: string): { l: number; c: number; h: number } | null {
  const match = value.match(/oklch\(([^\)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(/\s+/).filter(Boolean);
  const l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2] || '0');
  return { l, c, h };
}

function contrastRatio(lightness1: number, lightness2: number): number {
  const L1 = Math.max(lightness1, lightness2);
  const L2 = Math.min(lightness1, lightness2);
  return (L1 + 0.05) / (L2 + 0.05);
}

function getVariables(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return {};
  const braceStart = css.indexOf('{', start);
  const braceEnd = css.indexOf('}', braceStart);
  const block = css.slice(braceStart + 1, braceEnd);
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const vars: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(/^--([a-zA-Z0-9-]+):\s*(.+);$/);
    if (m) vars[m[1]] = m[2];
  }
  return vars;
}

describe('Color contrast', () => {
  const cssPath = path.resolve(__dirname, '../../app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  it('meets WCAG ratios in light mode', () => {
    const vars = getVariables(css, ':root');
    const bg = parseOKLCH(vars['background'])!;
    const fg = parseOKLCH(vars['foreground'])!;
    const mutedFg = parseOKLCH(vars['muted-foreground'])!;

    expect(contrastRatio(bg.l, fg.l)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(bg.l, mutedFg.l)).toBeGreaterThanOrEqual(4.5);
    const primaryText = parseOKLCH(vars['primary'])!;
    expect(contrastRatio(bg.l, primaryText.l)).toBeGreaterThanOrEqual(4.5);
    const primaryFg = parseOKLCH(vars['primary-foreground'])!;
    expect(contrastRatio(primaryFg.l, primaryText.l)).toBeGreaterThanOrEqual(4.5);
    const ring = parseOKLCH(vars['ring'])!;
    expect(contrastRatio(bg.l, ring.l)).toBeGreaterThanOrEqual(3);
  });

  it('meets WCAG ratios in dark mode', () => {
    const vars = getVariables(css, '.dark');
    const bg = parseOKLCH(vars['background'])!;
    const fg = parseOKLCH(vars['foreground'])!;
    const mutedFg = parseOKLCH(vars['muted-foreground'])!;

    expect(contrastRatio(bg.l, fg.l)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(bg.l, mutedFg.l)).toBeGreaterThanOrEqual(4.5);
    const ring = parseOKLCH(vars['ring'])!;
    expect(contrastRatio(bg.l, ring.l)).toBeGreaterThanOrEqual(3);
  });
});
