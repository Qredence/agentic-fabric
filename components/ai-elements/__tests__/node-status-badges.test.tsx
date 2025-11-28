import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExecutorNode } from '../executors/executor-node';
import { ReactFlowProvider } from '@xyflow/react';

describe('node status badges', () => {
  it('renders status label when provided', () => {
    render(
      <ReactFlowProvider>
        <ExecutorNode
          id="n1"
          data={{
            variant: 'executor',
            handles: { target: true, source: true },
            executor: { id: 'e1', type: 'executor', label: 'Exec' } as any,
            executorType: 'executor',
            status: 'running',
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getByText('running')).toBeTruthy();
  });
});
