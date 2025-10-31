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
import { Workflow, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowExecutor } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";

/**
 * Workflow executor node data
 */
export interface WorkflowExecutorNodeData {
  variant: "workflow-executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: WorkflowExecutor;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
}

/**
 * Props for WorkflowExecutorNode component
 */
export type WorkflowExecutorNodeProps = any;

/**
 * Workflow executor node component - represents a nested workflow
 */
export const WorkflowExecutorNode = memo(({ id, data, selected }: WorkflowExecutorNodeProps) => {
  const { handles, executor, label, description, status } = data;

  const displayLabel = label || executor.label || executor.workflowId || executor.id;
  const displayDescription = description || executor.description || `Nested workflow: ${executor.workflowId}`;

  const executorsCount = executor.workflowDefinition?.executors.length || 0;
  const edgesCount = executor.workflowDefinition?.edges.length || 0;

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
                    layoutId={`workflow-title-${id}`}
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
                  Workflow
                </motion.div>
              </div>
              {/* Header Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  title="Edit workflow executor"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  title="Open nested workflow"
                >
                  <Workflow className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete workflow executor"
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
              {/* Primary Information Group */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Workflow ID
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 font-mono">
                    {executor.workflowId}
                  </div>
                </div>

                {executor.workflowDefinition && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Executors
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                        {executorsCount}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Edges
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                        {edgesCount}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mappings Section */}
              {(executor.inputMapping && Object.keys(executor.inputMapping).length > 0) || 
               (executor.outputMapping && Object.keys(executor.outputMapping).length > 0) ? (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Mappings
                  </h3>
                  {executor.inputMapping && Object.keys(executor.inputMapping).length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Input Mappings
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                        {Object.keys(executor.inputMapping).length} mapping(s)
                      </div>
                    </div>
                  )}
                  {executor.outputMapping && Object.keys(executor.outputMapping).length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Output Mappings
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                        {Object.keys(executor.outputMapping).length} mapping(s)
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Description Section */}
              {displayDescription && (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Description
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    {displayDescription}
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

WorkflowExecutorNode.displayName = "WorkflowExecutorNode";

