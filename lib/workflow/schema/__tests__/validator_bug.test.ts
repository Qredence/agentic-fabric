import { describe, it, expect } from 'vitest';
import { checkReferentialIntegrity } from '@/lib/workflow/schema/validator';

describe('Referential Integrity Check Bug', () => {
  it('should detect invalid references in SingleEdgeGroup', () => {
    const invalidWorkflow = {
      id: 'wf-bug',
      executors: [
        { id: 'node-1', type: 'executor' },
        { id: 'node-2', type: 'executor' }
      ],
      edges: [],
      edgeGroups: [
        {
          id: 'group-1',
          type: 'single',
          edge: {
            id: 'edge-1',
            source: 'node-1',
            target: 'MISSING_NODE' // This should be flagged
          }
        },
        {
          id: 'group-2',
          type: 'single',
          edge: {
            id: 'edge-2',
            source: 'MISSING_SOURCE', // This should be flagged
            target: 'node-2'
          }
        }
      ]
    };

    const result = checkReferentialIntegrity(invalidWorkflow);

    // This expectation will fail if the bug is present (it will return true)
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.some(e => e.includes('Unknown target: MISSING_NODE'))).toBe(true);
    expect(result.errors?.some(e => e.includes('Unknown source: MISSING_SOURCE'))).toBe(true);
  });
});
