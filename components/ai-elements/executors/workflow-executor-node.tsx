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
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Workflow, Pencil, Trash2, Settings } from "lucide-react";
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
            className="mb-2 px-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 pt-4">
              <div className="min-w-0">
                <motion.div
                  layoutId={`workflow-title-${id}`}
                  transition={springTransition}
                  className="text-[24px] leading-[30px] truncate text-gray-300"
                >
                  {displayLabel}
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
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
                  className="text-sm text-gray-600 truncate max-w-[120px]"
                >
                  Workflow
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Configure Section */}
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
              delay: 0.15,
            }}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
          >
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Configure Workflow</span>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                delay: 0.2,
              }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Workflow ID
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 font-mono">
                  {executor.workflowId}
                </div>
              </div>

              {executor.workflowDefinition && (
                <>
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
                </>
              )}

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

              {displayDescription && (
                <div className="space-y-2">
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

          {/* Footer with Actions */}
          <div className="border-t border-white/5 px-4 py-3">
            <Toolbar>
              <Actions>
                <Action tooltip="Edit workflow executor" label="Edit" aria-label="Edit">
                  <Pencil className="size-4" />
                </Action>
                <Action tooltip="Open nested workflow" label="Open" aria-label="Open">
                  <Workflow className="size-4" />
                </Action>
                <Action tooltip="Delete workflow executor" label="Delete" aria-label="Delete">
                  <Trash2 className="size-4" />
                </Action>
              </Actions>
            </Toolbar>
          </div>
        </div>
      </Node>
    </ExecutorNodeWrapper>
  );
});

WorkflowExecutorNode.displayName = "WorkflowExecutorNode";

