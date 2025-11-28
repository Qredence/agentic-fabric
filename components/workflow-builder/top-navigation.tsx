'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Code, Eye, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workflow } from '@/lib/workflow/workflow';
import { validateWorkflowExtended } from '@/lib/workflow/export/validator';
import { ThemeToggle } from '@/components/theme-toggle';
import logoLightmode from '@/public/logo-lightmode.svg';
import logoDarkmode from '@/public/logo-darkmode.svg';

interface TopNavigationProps {
  projectName?: string;
  projectStatus?: string;
  workflow?: Workflow | null;
  onEvaluate?: () => void;
  onCode?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onValidate?: () => void;
}

export function TopNavigation({
  projectName = 'MCP Draft',
  projectStatus,
  workflow,
  onEvaluate,
  onCode,
  onPreview,
  onPublish,
  onValidate,
}: TopNavigationProps) {
  const displayName = projectStatus ? `${projectName} ${projectStatus}` : projectName;

  const validation = workflow ? validateWorkflowExtended(workflow) : null;

  const isValid = validation?.valid ?? false;

  return (
    <div
      className={cn(
        'absolute top-0 left-0 right-0 w-full',
        'flex items-center justify-between h-14 px-6 bg-transparent',
        'border-b border-transparent',
        'text-white z-50',
      )}
    >
      {/* Left side: Project name/status */}
      <div className="flex items-center gap-2">
        <img src={logoDarkmode.src} alt="Logo" className="size-8 hidden dark:block" />{' '}
        <img src={logoLightmode.src} alt="Logo" className="size-8 dark:hidden" />{' '}
        <h1 className="text-lg font-semibold text-gray-200">{displayName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={onEvaluate} aria-label="Evaluate">
          <Play className="size-4 mr-2" />
          Evaluate
        </Button>
        <Button variant="outline" onClick={onCode} aria-label="Code">
          <Code className="size-4 mr-2" />
          Code
        </Button>
        <Button variant="outline" onClick={onPreview} aria-label="Preview">
          <Eye className="size-4 mr-2" />
          Preview
        </Button>
        <Button onClick={onPublish} aria-label="Publish">
          <Upload className="size-4 mr-2" />
          Publish
        </Button>
        {validation && (
          <div className="ml-2 flex items-center">
            {isValid ? (
              <CheckCircle2 className="size-5 text-green-400" aria-label="Valid" />
            ) : (
              <AlertCircle className="size-5 text-yellow-400" aria-label="Issues" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
