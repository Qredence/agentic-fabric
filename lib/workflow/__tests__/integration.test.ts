import { describe, it, expect } from 'vitest';
import { reactFlowToWorkflow, workflowToReactFlow } from '../conversion';
import {
  serializeToJSON,
  deserializeFromJSON,
  serializeToYAML,
  deserializeFromYAML,
} from '../export/serializers';
import { validateWorkflow } from '../workflow';

describe('Integration Tests', () => {
  it('should round-trip workflow through React Flow and back', () => {
    const originalNodes = [
      {
        id: 'executor-1',
        type: 'executor',
        position: { x: 100, y: 100 },
        data: {
          variant: 'executor' as const,
          handles: { target: true, source: true },
          executor: {
            id: 'executor-1',
            type: 'executor',
            label: 'Test Executor',
          },
          executorType: 'executor' as const,
        },
      },
      {
        id: 'agent-1',
        type: 'agent-executor',
        position: { x: 300, y: 100 },
        data: {
          variant: 'agent-executor' as const,
          handles: { target: true, source: true },
          executor: {
            id: 'agent-1',
            type: 'agent-executor',
            agentId: 'agent-1',
            model: 'gpt-4',
          } as any,
        },
      },
    ];

    const originalEdges = [
      {
        id: 'edge-1',
        source: 'executor-1',
        target: 'agent-1',
        type: 'animated',
      },
    ];

    // Convert to workflow
    const workflow = reactFlowToWorkflow(
      originalNodes as any,
      originalEdges,
      'workflow-1',
      'Integration Test',
    );

    // Convert back to React Flow
    const { nodes, edges } = workflowToReactFlow(workflow);

    // Verify structure
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe('executor-1');
    expect(edges[0].target).toBe('agent-1');
  });

  it('should serialize and deserialize workflow maintaining structure', () => {
    const workflow = {
      id: 'workflow-1',
      name: 'Test Workflow',
      executors: [
        {
          id: 'executor-1',
          type: 'executor',
          label: 'Executor 1',
        },
        {
          id: 'function-1',
          type: 'function-executor',
          functionName: 'processData',
        } as any,
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'executor-1',
          target: 'function-1',
          condition: {
            type: 'predicate' as const,
            expression: "message.type === 'data'",
          },
        },
      ],
      metadata: {
        author: 'Test',
      },
    };

    // JSON round-trip
    const json = serializeToJSON(workflow);
    const deserialized = deserializeFromJSON(json);

    expect(deserialized.id).toBe(workflow.id);
    expect(deserialized.executors).toHaveLength(2);
    expect(deserialized.edges[0].condition?.expression).toBe(
      workflow.edges[0].condition?.expression,
    );

    // YAML round-trip
    const yaml = serializeToYAML(workflow);
    const deserializedYaml = deserializeFromYAML(yaml);

    expect(deserializedYaml.id).toBe(workflow.id);
    expect(deserializedYaml.executors).toHaveLength(2);
  });

  it('should validate workflow after round-trip conversion', () => {
    const workflow = {
      id: 'workflow-1',
      executors: [
        { id: 'executor-1', type: 'executor' },
        { id: 'executor-2', type: 'executor' },
      ],
      edges: [{ id: 'edge-1', source: 'executor-1', target: 'executor-2' }],
    };

    // Convert through React Flow
    const { nodes, edges } = workflowToReactFlow(workflow);
    const converted = reactFlowToWorkflow(nodes, edges, 'workflow-2');

    // Should still be valid
    const validation = validateWorkflow(converted);
    expect(validation.valid).toBe(true);
  });

  it('should handle empty workflow', () => {
    const emptyWorkflow = {
      id: 'empty-workflow',
      executors: [],
      edges: [],
    };

    const { nodes, edges } = workflowToReactFlow(emptyWorkflow);
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);

    const converted = reactFlowToWorkflow(nodes, edges, 'workflow-back');
    expect(converted.executors).toHaveLength(0);
    expect(converted.edges).toHaveLength(0);
  });

  it('should handle workflow with multiple executor types', () => {
    const workflow = {
      id: 'multi-type-workflow',
      executors: [
        { id: 'exec-1', type: 'executor' },
        { id: 'func-1', type: 'function-executor', functionName: 'test' } as any,
        { id: 'agent-1', type: 'agent-executor', agentId: 'agent-1' } as any,
        { id: 'workflow-1', type: 'workflow-executor', workflowId: 'nested' } as any,
        { id: 'req-1', type: 'request-info-executor', requestType: 'user' } as any,
      ],
      edges: [
        { id: 'e1', source: 'exec-1', target: 'func-1' },
        { id: 'e2', source: 'func-1', target: 'agent-1' },
        { id: 'e3', source: 'agent-1', target: 'workflow-1' },
        { id: 'e4', source: 'workflow-1', target: 'req-1' },
      ],
    };

    const json = serializeToJSON(workflow);
    const deserialized = deserializeFromJSON(json);

    expect(deserialized.executors).toHaveLength(5);
    expect(deserialized.executors[0].type).toBe('executor');
    expect(deserialized.executors[1].type).toBe('function-executor');
    expect(deserialized.executors[2].type).toBe('agent-executor');
    expect(deserialized.executors[3].type).toBe('workflow-executor');
    expect(deserialized.executors[4].type).toBe('request-info-executor');
  });
});
