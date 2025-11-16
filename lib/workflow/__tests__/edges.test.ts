import { describe, it, expect } from 'vitest';
import {
  createSingleEdgeGroup,
  createFanInEdgeGroup,
  createFanOutEdgeGroup,
  createSwitchCaseEdgeGroup,
  isSingleEdgeGroup,
  isFanInEdgeGroup,
  isFanOutEdgeGroup,
  isSwitchCaseEdgeGroup,
  getEdgeGroupTypeLabel,
  getEdgeGroupTypeDescription,
} from '../edges';
import type {
  SingleEdgeGroup,
  FanInEdgeGroup,
  FanOutEdgeGroup,
  SwitchCaseEdgeGroup,
} from '../edges';
import type { BaseEdge } from '../types';

describe('Edge Group Utilities', () => {
  describe('createSingleEdgeGroup', () => {
    it('should create a single edge group', () => {
      const edge: BaseEdge = {
        id: 'edge-1',
        source: 'executor-1',
        target: 'executor-2',
      };
      const group = createSingleEdgeGroup(edge);
      expect(group.type).toBe('single');
      expect(group.edge).toEqual(edge);
    });
  });

  describe('createFanInEdgeGroup', () => {
    it('should create a fan-in edge group', () => {
      const sources = ['executor-1', 'executor-2'];
      const target = 'executor-3';
      const edges: BaseEdge[] = [
        { id: 'edge-1', source: 'executor-1', target },
        { id: 'edge-2', source: 'executor-2', target },
      ];

      const group = createFanInEdgeGroup(sources, target, edges, 'merge');
      expect(group.type).toBe('fan-in');
      expect(group.sources).toEqual(sources);
      expect(group.target).toBe(target);
      expect(group.edges).toEqual(edges);
      expect(group.aggregationStrategy).toBe('merge');
    });

    it('should default aggregation strategy to merge', () => {
      const group = createFanInEdgeGroup(['executor-1'], 'executor-2', [
        { id: 'edge-1', source: 'executor-1', target: 'executor-2' },
      ]);
      expect(group.aggregationStrategy).toBe('merge');
    });
  });

  describe('createFanOutEdgeGroup', () => {
    it('should create a fan-out edge group', () => {
      const source = 'executor-1';
      const targets = ['executor-2', 'executor-3'];
      const edges: BaseEdge[] = [
        { id: 'edge-1', source, target: 'executor-2' },
        { id: 'edge-2', source, target: 'executor-3' },
      ];

      const group = createFanOutEdgeGroup(source, targets, edges, 'parallel');
      expect(group.type).toBe('fan-out');
      expect(group.source).toBe(source);
      expect(group.targets).toEqual(targets);
      expect(group.edges).toEqual(edges);
      expect(group.broadcastMode).toBe('parallel');
    });
  });

  describe('createSwitchCaseEdgeGroup', () => {
    it('should create a switch-case edge group', () => {
      const source = 'executor-1';
      const switchExpression = 'message.type';
      const cases = [
        {
          id: 'case-1',
          value: 'chat',
          target: 'executor-2',
          edge: { id: 'edge-1', source, target: 'executor-2' },
        },
        {
          id: 'case-2',
          value: 'error',
          target: 'executor-3',
          edge: { id: 'edge-2', source, target: 'executor-3' },
        },
      ];
      const defaultCase = {
        target: 'executor-4',
        edge: { id: 'edge-3', source, target: 'executor-4' },
      };

      const group = createSwitchCaseEdgeGroup(source, switchExpression, cases, defaultCase);
      expect(group.type).toBe('switch-case');
      expect(group.source).toBe(source);
      expect(group.switchExpression).toBe(switchExpression);
      expect(group.cases).toEqual(cases);
      expect(group.default).toEqual(defaultCase);
    });

    it('should create switch-case without default', () => {
      const group = createSwitchCaseEdgeGroup('executor-1', 'message.type', []);
      expect(group.default).toBeUndefined();
    });
  });

  describe('Type Guards', () => {
    it('should identify single edge groups', () => {
      const group: SingleEdgeGroup = {
        id: 'group-1',
        type: 'single',
        edge: { id: 'edge-1', source: 'executor-1', target: 'executor-2' },
      };
      expect(isSingleEdgeGroup(group)).toBe(true);
    });

    it('should identify fan-in edge groups', () => {
      const group: FanInEdgeGroup = {
        id: 'group-1',
        type: 'fan-in',
        sources: ['executor-1'],
        target: 'executor-2',
        edges: [],
      };
      expect(isFanInEdgeGroup(group)).toBe(true);
    });

    it('should identify fan-out edge groups', () => {
      const group: FanOutEdgeGroup = {
        id: 'group-1',
        type: 'fan-out',
        source: 'executor-1',
        targets: ['executor-2'],
        edges: [],
      };
      expect(isFanOutEdgeGroup(group)).toBe(true);
    });

    it('should identify switch-case edge groups', () => {
      const group: SwitchCaseEdgeGroup = {
        id: 'group-1',
        type: 'switch-case',
        source: 'executor-1',
        switchExpression: 'message.type',
        cases: [],
      };
      expect(isSwitchCaseEdgeGroup(group)).toBe(true);
    });
  });

  describe('getEdgeGroupTypeLabel', () => {
    it('should return correct labels for all edge group types', () => {
      expect(getEdgeGroupTypeLabel('single')).toBe('Single Edge');
      expect(getEdgeGroupTypeLabel('fan-in')).toBe('Fan-In (Multiple Sources)');
      expect(getEdgeGroupTypeLabel('fan-out')).toBe('Fan-Out (Multiple Targets)');
      expect(getEdgeGroupTypeLabel('switch-case')).toBe('Switch/Case Routing');
    });
  });

  describe('getEdgeGroupTypeDescription', () => {
    it('should return correct descriptions for all edge group types', () => {
      expect(getEdgeGroupTypeDescription('single')).toContain('One-to-one');
      expect(getEdgeGroupTypeDescription('fan-in')).toContain('Multiple sources');
      expect(getEdgeGroupTypeDescription('fan-out')).toContain('One source broadcasts');
      expect(getEdgeGroupTypeDescription('switch-case')).toContain('Conditional routing');
    });
  });
});
