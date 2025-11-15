"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Copy, Check } from "lucide-react";
import type { Workflow } from "@/lib/workflow/workflow";
import { serializeTopology } from "@/lib/workflow/export/topology";
import { serializeToJSON, serializeToYAML, downloadWorkflow } from "@/lib/workflow/export/serializers";
import { validateWorkflowExtended } from "@/lib/workflow/export/validator";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow | null;
}

export function ExportDialog({ open, onOpenChange, workflow }: ExportDialogProps) {
  const [format, setFormat] = useState<"json" | "yaml">("json");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const serialized = useMemo(() => {
    if (!workflow) return null;
    return format === "json" ? serializeToJSON(workflow, true) : serializeToYAML(workflow);
  }, [workflow, format]);

  const validation = useMemo(() => {
    if (!workflow) return null;
    return validateWorkflowExtended(workflow);
  }, [workflow]);

  const handleDownload = () => {
    if (!workflow) return;
    downloadWorkflow(workflow, format);
  };

  const handleCopy = async () => {
    if (!serialized) return;
    await navigator.clipboard.writeText(serialized);
    setCopied(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTopology = async () => {
    if (!workflow) return;
    const topo = serializeTopology(workflow);
    const text = JSON.stringify(topo, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  if (!workflow) {
    return null;
  }

  const hasErrors = validation && (validation.valid === false || validation.typeErrors.length > 0);
  const hasWarnings = validation && (validation.warnings.length > 0 || validation.connectivityWarnings.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Workflow</DialogTitle>
          <DialogDescription>
            Export your workflow definition in JSON or YAML format
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Format selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Format:</label>
            <Select value={format} onValueChange={(value) => setFormat(value as "json" | "yaml")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Validation status */}
          {validation && (
            <div className="space-y-2">
              {hasErrors && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md p-3">
                  <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Validation Errors
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                    {validation.errors.map((error, idx) => (
                      <div key={idx}>• {error.message}</div>
                    ))}
                    {validation.typeErrors.map((error, idx) => (
                      <div key={idx}>• {error.message}</div>
                    ))}
                  </div>
                </div>
              )}
              {hasWarnings && !hasErrors && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-md p-3">
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Warnings
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                    {validation.warnings.map((warning, idx) => (
                      <div key={idx}>• {warning.message}</div>
                    ))}
                    {validation.connectivityWarnings.map((warning, idx) => (
                      <div key={idx}>• {warning.message}</div>
                    ))}
                  </div>
                </div>
              )}
              {!hasErrors && !hasWarnings && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md p-3">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✓ Workflow is valid
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <label className="text-sm font-medium mb-2">Preview:</label>
            <div className="flex-1 overflow-auto bg-muted rounded-md p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                {serialized || "No workflow to export"}
              </pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopy} disabled={!serialized || false}>
            {copied ? (
              <>
                <Check className="size-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCopyTopology} disabled={!workflow}>
            <Copy className="size-4 mr-2" />
            Copy Topology
          </Button>
          <Button onClick={handleDownload} disabled={!serialized || !!hasErrors}>
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
