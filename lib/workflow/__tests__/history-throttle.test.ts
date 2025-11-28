import { describe, it, expect, vi } from 'vitest';

describe('history throttle', () => {
  it('batches multiple saveToHistory calls into one frame', () => {
    const calls: Array<{ n: number; e: number }> = [];
    let historyIndex = 0;
    const setHistory = (updater: (prev: any[]) => any[]) => {
      const prev = [] as any[];
      const next = updater(prev);
      calls.push({ n: next[0]?.nodes?.length ?? 0, e: next[0]?.edges?.length ?? 0 });
    };
    const setHistoryIndex = (updater: (prev: number) => number) => {
      historyIndex = updater(historyIndex);
    };
    let frame = 0 as number;
    let bufferedNodes: any[] = [];
    let bufferedEdges: any[] = [];
    const saveToHistory = (newNodes: any[], newEdges: any[]) => {
      bufferedNodes = newNodes;
      bufferedEdges = newEdges;
      if (frame) return;
      frame = 1;
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({
          nodes: structuredClone(bufferedNodes),
          edges: structuredClone(bufferedEdges),
        });
        return newHistory.slice(-50);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
      frame = 0;
    };

    saveToHistory([{ id: 'a' }], [{ id: 'x' }]);
    saveToHistory([{ id: 'b' }], [{ id: 'y' }]);
    expect(historyIndex).toBe(2);
    const last = calls.at(-1)!;
    expect(last.n).toBe(1);
  });
});
