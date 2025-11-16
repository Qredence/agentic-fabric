import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodeLibrary } from '@/components/workflow-builder/node-library';

describe('NodeLibrary accessibility', () => {
  it('renders items as buttons with accessible labels and supports keyboard activation', async () => {
    const user = userEvent.setup();
    const onAddNode = vi.fn();
    render(
      <NodeLibrary onDragStart={() => {}} onAddNode={onAddNode} onAddMagenticScaffold={() => {}} />,
    );

    const items = await screen.findAllByRole('button', { name: /agent/i });
    expect(items[0]).toBeInTheDocument();

    items[0].focus();
    await user.keyboard('{Enter}');
    expect(onAddNode).toHaveBeenCalled();
  });
});
