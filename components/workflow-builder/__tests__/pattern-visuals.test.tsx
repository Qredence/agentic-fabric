import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { SwitchCaseNode } from '@/components/ai-elements/edge-groups/switch-case-node';
import { FanOutNode } from '@/components/ai-elements/edge-groups/fan-out-node';
import { WorkflowExecutorNode } from '@/components/ai-elements/executors/workflow-executor-node';

describe('Pattern visuals consistency', () => {
  it('renders SwitchCase with status and error', () => {
    render(
      // @ts-ignore test simplified props
      <ReactFlowProvider>
        <SwitchCaseNode
          id="s1"
          data={{
            variant: 'switch-case',
            handles: { target: true, source: true },
            group: {
              id: 'g1',
              source: 'a',
              cases: [{ id: 'c1', value: 'x', target: 'b' }],
              switchExpression: 'x',
              default: { target: 'b' },
            },
            label: 'Handoff',
            status: 'error',
            error: 'Specialist unavailable',
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getAllByText(/Handoff/i)[0]).toBeTruthy();
    expect(screen.getAllByText(/Error/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Handoff error/i)).toBeTruthy();
  });

  it('renders WorkflowExecutor with nesting indicator', () => {
    render(
      // @ts-ignore test simplified props
      <ReactFlowProvider>
        <WorkflowExecutorNode
          id="w1"
          data={{
            variant: 'workflow-executor',
            handles: { target: true, source: true },
            executor: {
              id: 'we1',
              type: 'workflow-executor',
              workflowId: 'child',
              label: 'Child Workflow',
            },
            childCount: 2,
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getByText(/Nested 2/i)).toBeTruthy();
  });

  it('renders FanOut with broadcasting and sync target', () => {
    render(
      // @ts-ignore test simplified props
      <ReactFlowProvider>
        <FanOutNode
          id="f1"
          data={{
            variant: 'fan-out',
            handles: { target: true, source: true },
            group: { id: 'fo1', source: 'a', targets: ['b', 'c'], broadcastMode: 'parallel' },
            label: 'Parallel',
            status: 'broadcast',
            syncTargetId: 'join1',
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getByText(/Broadcasting/i)).toBeTruthy();
    expect(screen.getByText(/Sync at/i)).toBeTruthy();
  });
});
