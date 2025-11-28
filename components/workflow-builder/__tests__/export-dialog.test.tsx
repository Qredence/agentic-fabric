import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ExportDialog } from '../export-dialog';

const sampleWorkflow = {
  id: 'w1',
  name: 'Test',
  executors: [],
  edges: [],
  metadata: { createdAt: new Date().toISOString() },
} as any;

describe('ExportDialog', () => {
  it('renders preview when open', () => {
    render(<ExportDialog open={true} onOpenChange={() => {}} workflow={sampleWorkflow} />);
    expect(screen.getByText('Export Workflow')).toBeTruthy();
    expect(screen.getByText('Preview:')).toBeTruthy();
  });
});
