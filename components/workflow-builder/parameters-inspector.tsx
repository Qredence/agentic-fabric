'use client';

import { Panel } from '@/components/ai-elements/panel';
import { cn } from '@/lib/utils';
import type { Workflow } from '@/lib/workflow/workflow';
import { extractWorkflowParameters } from '@/lib/workflow/parameters';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow;
};

export function ParametersInspector({ open, onOpenChange, workflow }: Props) {
  if (!open) return null;
  const sections = extractWorkflowParameters(workflow);
  return (
    <Panel
      position="bottom-right"
      className={cn('m-0 mr-6 mb-6 w-[min(100%,480px)] p-3', 'max-h-[40vh] overflow-y-auto')}
      role="region"
      aria-label="Parameters Inspector"
    >
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.id} className="border rounded-md p-3 bg-secondary">
            <div className="text-sm font-semibold">
              {s.label || s.id} • {s.type}
            </div>
            <div className="mt-2 space-y-1">
              {Object.keys(s.params).length === 0 ? (
                <div className="text-xs text-muted-foreground">No parameters</div>
              ) : (
                Object.entries(s.params).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-muted-foreground">{k}:</span> {String(v)}
                  </div>
                ))
              )}
            </div>
            {s.children.length > 0 && (
              <div className="mt-2 pl-3 border-l space-y-2">
                {s.children.map((c) => (
                  <div key={c.id} className="border rounded p-2">
                    <div className="text-xs font-medium">
                      {c.label || c.id} • {c.type}
                    </div>
                    <div className="mt-1 space-y-1">
                      {Object.keys(c.params).length === 0 ? (
                        <div className="text-xs text-muted-foreground">No parameters</div>
                      ) : (
                        Object.entries(c.params).map(([k, v]) => (
                          <div key={k} className="text-xs">
                            <span className="text-muted-foreground">{k}:</span> {String(v)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="text-xs text-muted-foreground" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    </Panel>
  );
}
