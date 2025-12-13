'use client';

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { AgenticFleetCanvas } from '@/components/agentic-fleet/agentic-fleet-canvas';

export default function AgenticFleetPage() {
  return (
    <div className="h-screen w-screen">
      <ReactFlowProvider>
        <AgenticFleetCanvas />
      </ReactFlowProvider>
    </div>
  );
}
