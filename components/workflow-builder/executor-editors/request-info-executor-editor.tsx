'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { RequestInfoExecutor } from '@/lib/workflow/executors';

interface RequestInfoExecutorEditorProps {
  executor: RequestInfoExecutor;
  onChange: (updates: Partial<RequestInfoExecutor>) => void;
}

export function RequestInfoExecutorEditor({ executor, onChange }: RequestInfoExecutorEditorProps) {
  return (
    <div className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-medium">Request Info Configuration</h4>

      <div className="space-y-2">
        <Label htmlFor="request-type">Request Type</Label>
        <Input
          id="request-type"
          value={executor.requestType || ''}
          onChange={(e) => onChange({ requestType: e.target.value })}
          placeholder="user-input"
        />
        <p className="text-xs text-muted-foreground">
          Type of external information request (e.g., "user-input", "api-call")
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeout">Timeout (ms)</Label>
        <Input
          id="timeout"
          type="number"
          min="0"
          value={executor.timeout ?? ''}
          onChange={(e) =>
            onChange({
              timeout: e.target.value ? Number.parseInt(e.target.value, 10) : undefined,
            })
          }
          placeholder="5000"
        />
      </div>

      {executor.retryPolicy && (
        <div className="space-y-2 pt-2 border-t">
          <Label>Retry Policy</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-retries" className="text-xs">
                Max Retries
              </Label>
              <Input
                id="max-retries"
                type="number"
                min="0"
                value={executor.retryPolicy.maxRetries}
                onChange={(e) =>
                  onChange({
                    retryPolicy: {
                      ...executor.retryPolicy!,
                      maxRetries: Number.parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backoff-ms" className="text-xs">
                Backoff (ms)
              </Label>
              <Input
                id="backoff-ms"
                type="number"
                min="0"
                value={executor.retryPolicy.backoffMs ?? ''}
                onChange={(e) =>
                  onChange({
                    retryPolicy: {
                      ...executor.retryPolicy!,
                      backoffMs: e.target.value ? Number.parseInt(e.target.value, 10) : undefined,
                    },
                  })
                }
                placeholder="1000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={executor.retryPolicy.exponentialBackoff || false}
                onChange={(e) =>
                  onChange({
                    retryPolicy: {
                      ...executor.retryPolicy!,
                      exponentialBackoff: e.target.checked,
                    },
                  })
                }
                className="rounded"
              />
              <span className="text-xs">Exponential Backoff</span>
            </label>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="response-handler">Response Handler</Label>
        <Input
          id="response-handler"
          value={executor.responseHandler || ''}
          onChange={(e) => onChange({ responseHandler: e.target.value || undefined })}
          placeholder="handleResponse"
        />
        <p className="text-xs text-muted-foreground">
          Optional handler function name for processing responses
        </p>
      </div>
    </div>
  );
}
