import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertiesPanel } from '@/components/workflow-builder/properties-panel';

const sampleNode = {
  id: 'node-guardrails',
  type: 'agent-executor',
  data: {
    executor: {
      id: 'exec-guardrails',
      type: 'agent-executor',
      label: 'Guardrails',
      description: 'Run moderation, PII, jailbreak, or hallucination checks',
    },
    executorType: 'agent-executor',
    label: 'Guardrails',
    description: 'Run moderation, PII, jailbreak, or hallucination checks',
  },
};

describe('PropertiesPanel Guardrails', () => {
  it('renders guardrails switches with labels', () => {
    render(<PropertiesPanel selectedNode={sampleNode as any} onUpdate={() => {}} />);
    expect(screen.getByLabelText(/Personally identifiable information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Moderation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jailbreak/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hallucination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Continue on error/i)).toBeInTheDocument();
  });

  it('updates store and calls onUpdate when toggles change', () => {
    const onUpdate = vi.fn();
    render(<PropertiesPanel selectedNode={sampleNode as any} onUpdate={onUpdate} />);

    const jailbreak = screen.getByLabelText(/Jailbreak/i);
    fireEvent.click(jailbreak);
    expect(onUpdate).toHaveBeenCalled();
  });

  it('renders Input pill with STRING tag', () => {
    render(<PropertiesPanel selectedNode={sampleNode as any} onUpdate={() => {}} />);
    expect(screen.getByText(/STRING/i)).toBeInTheDocument();
    expect(screen.getByText(/input_as_text/i)).toBeInTheDocument();
  });
});
