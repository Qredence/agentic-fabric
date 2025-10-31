"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps as ReactFlowNodeProps } from "@xyflow/react";
import { motion } from "motion/react";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseExecutor, ExecutorId } from "@/lib/workflow/types";
import type { ExecutorType } from "@/lib/workflow/executors";
import { getExecutorTypeLabel } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";
import { Badge } from "@/components/ui/badge";

const truncateText = (value: string | undefined, max = 200) => {
  if (!value) {
    return "";
  }
  return value.length > max ? `${value.slice(0, max)}…` : value;
};

/**
 * Executor node data for React Flow
 */
export interface ExecutorNodeData {
  variant: "executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: BaseExecutor;
  executorType: ExecutorType;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
  error?: string;
}

/**
 * Props for ExecutorNode component
 */
export type ExecutorNodeProps = any;

/**
 * Base executor node component - displays an executor in the workflow canvas
 */
export const ExecutorNode = memo(({ id, data, selected }: ExecutorNodeProps) => {
  const { handles, executor, executorType, label, description, status, error } = data;

  const displayLabel = label || executor.label || executor.id;
  const rawDescription = description || executor.description || getExecutorTypeLabel(executorType);
  const displayDescription = truncateText(rawDescription, 200);
  const metadata = (executor.metadata as Record<string, any> | undefined) ?? {};
  const magenticMeta = (metadata.magentic as Record<string, any> | undefined) ?? {};
  const planningStrategy = (executor as any).planningStrategy || magenticMeta.planningStrategy;
  const progressTracking = (executor as any).progressTracking;
  const humanInTheLoop = (executor as any).humanInTheLoop;
  const orchestratorPreset = magenticMeta.presetKey as string | undefined;

  const statusColors = {
    idle: "text-gray-500",
    running: "text-blue-500",
    completed: "text-green-500",
    error: "text-red-500",
  };

  const statusBgColors = {
    idle: "bg-gray-500/20",
    running: "bg-blue-500/20",
    completed: "bg-green-500/20",
    error: "bg-red-500/20",
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <ExecutorNodeWrapper selected={selected} dataId={id} handles={handles}>
      <Node handles={{ target: false, source: false }} className="h-full w-full bg-transparent border-none shadow-none rounded-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <motion.div
            initial={{
              y: -10,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              ...springTransition,
              delay: 0.1,
            }}
            className="px-4 pt-4 pb-3 border-b border-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    layoutId={`executor-title-${id}`}
                    transition={springTransition}
                    className="text-[24px] leading-[30px] truncate text-gray-300"
                  >
                    {displayLabel}
                  </motion.div>
                  {status && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0 flex items-center justify-center",
                        statusBgColors[status as keyof typeof statusBgColors]
                      )}
                      title={status}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          statusColors[status as keyof typeof statusColors]
                        )}
                      />
                    </div>
                  )}
                </div>
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    ...springTransition,
                    delay: 0.05,
                  }}
                  className="text-sm text-gray-600"
                >
                  {getExecutorTypeLabel(executorType)}
                </motion.div>
              </div>
              {/* Header Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  title="Edit executor"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete executor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                ...springTransition,
                delay: 0.15,
              }}
              className="space-y-4"
            >
              {/* Status and Error Information */}
              {(status || error) && (
                <div className="space-y-3">
                  {status && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Status
                      </label>
                      <div className={cn("px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm font-medium", statusColors[status as keyof typeof statusColors])}>
                        {status}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Error
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Configuration (Magentic Orchestrator) */}
              {executorType === "magentic-orchestrator-executor" && (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Configuration
                  </h3>
                  {planningStrategy && (
                    <div className="flex items-center justify-between py-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Planning Strategy
                      </label>
                      <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-200 capitalize">
                        {planningStrategy}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Progress Tracking
                    </label>
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm",
                      progressTracking === false ? "text-gray-500" : "text-green-400"
                    )}>
                      {progressTracking === false ? "Disabled" : "Enabled"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">
                      Human in the Loop
                    </label>
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm",
                      humanInTheLoop ? "text-orange-400" : "text-gray-500"
                    )}>
                      {humanInTheLoop ? "Required" : "Optional"}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Node>
    </ExecutorNodeWrapper>
  );
});

ExecutorNode.displayName = "ExecutorNode";
