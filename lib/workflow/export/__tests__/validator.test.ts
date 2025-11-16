import { describe, it, expect } from 'vitest';
import { validateWorkflowExtended, validateWorkflowSchema } from '../validator';
import type { Workflow } from '../../workflow';

describe('Workflow Validator', () => {
  describe('validateWorkflowExtended', () => {
    it('should validate a valid workflow', () => {
      const workflow: Workflow = {
        id: 'workflow-1',
        executors: [
          { id: 'executor-1', type: 'executor' },
          { id: 'executor-2', type: 'executor' },
        ],
        edges: [{ id: 'edge-1', source: 'executor-1', target: 'executor-2' }],
      };

      const result = validateWorkflowExtended(workflow);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.typeErrors).toHaveLength(0);
    });

    it('should detect invalid executor types', () => {
      const workflow: Workflow = {
        id: 'workflow-1',
        executors: [{ id: 'executor-1', type: 'invalid-type' as any }],
        edges: [],
      };

      const result = validateWorkflowExtended(workflow);
      expect(result.typeErrors.length).toBeGreaterThan(0);
      expect(result.typeErrors.some((e) => e.code === 'invalid-executor-type')).toBe(true);
    });

    it('should detect connectivity issues', () => {
      const workflow: Workflow = {
        id: 'workflow-1',
        executors: [
          { id: 'executor-1', type: 'executor' },
          { id: 'executor-2', type: 'executor' },
        ],
        edges: [], // No edges, so executors are isolated
      };

      const result = validateWorkflowExtended(workflow);
      expect(result.connectivityWarnings.length).toBeGreaterThan(0);
    });

    it('should detect executors with no incoming edges', () => {
      const workflow: Workflow = {
        id: 'workflow-1',
        executors: [
          { id: 'executor-1', type: 'executor' },
          { id: 'executor-2', type: 'executor' },
        ],
        edges: [
          { id: 'edge-1', source: 'executor-1', target: 'executor-2' },
          // executor-1 has no incoming edges
        ],
      };

      const result = validateWorkflowExtended(workflow);
      expect(result.connectivityWarnings.some((w) => w.code === 'no-incoming-edges')).toBe(true);
    });
  });

  describe('validateWorkflowSchema', () => {
    it('should validate a valid workflow object', () => {
      const validWorkflow = {
        id: 'workflow-1',
        executors: [{ id: 'executor-1', type: 'executor' }],
        edges: [{ id: 'edge-1', source: 'executor-1', target: 'executor-1' }],
      };

      const result = validateWorkflowSchema(validWorkflow);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object workflows', () => {
      const result = validateWorkflowSchema(null);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('must be an object'))).toBe(true);
    });

    it('should reject workflows without id', () => {
      const invalid = {
        executors: [],
        edges: [],
      };

      const result = validateWorkflowSchema(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('id'))).toBe(true);
    });

    it('should reject invalid executors array', () => {
      const invalid = {
        id: 'workflow-1',
        executors: 'not-an-array',
        edges: [],
      };

      const result = validateWorkflowSchema(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('executors'))).toBe(true);
    });

    it('should reject invalid edges array', () => {
      const invalid = {
        id: 'workflow-1',
        executors: [],
        edges: 'not-an-array',
      };

      const result = validateWorkflowSchema(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('edges'))).toBe(true);
    });

    it('should validate executor structure', () => {
      const invalid = {
        id: 'workflow-1',
        executors: [
          { type: 'executor' }, // Missing id
        ],
        edges: [],
      };

      const result = validateWorkflowSchema(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('id'))).toBe(true);
    });

    it('should validate edge structure', () => {
      const invalid = {
        id: 'workflow-1',
        executors: [{ id: 'executor-1', type: 'executor' }],
        edges: [
          { source: 'executor-1' }, // Missing target
        ],
      };

      const result = validateWorkflowSchema(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('target'))).toBe(true);
    });
  });
});
