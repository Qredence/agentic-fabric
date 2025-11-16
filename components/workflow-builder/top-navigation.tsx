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
  const hasErrors = validation
    ? validation.valid === false || validation.typeErrors.length > 0
    : false;
  const hasWarnings =
    validation && (validation.warnings.length > 0 || validation.connectivityWarnings.length > 0);

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
      {/* Right side: Action buttons */}
    </div>
  );
}
