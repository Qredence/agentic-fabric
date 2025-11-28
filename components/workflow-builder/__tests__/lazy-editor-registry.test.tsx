import { describe, it, expect } from 'vitest';
import { getEditorEntry } from '@/lib/workflow/editor-registry';

describe('editor registry', () => {
  it('provides loader for function-executor', async () => {
    const entry = getEditorEntry('function-executor')!;
    const mod = await entry.editor();
    expect(typeof mod.default).toBe('function');
  });
});
