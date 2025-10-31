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
import { Globe, Pencil, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestInfoExecutor } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";

/**
 * Request info executor node data
 */
export interface RequestInfoExecutorNodeData {
  variant: "request-info-executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: RequestInfoExecutor;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
}

/**
 * Props for RequestInfoExecutorNode component
 */
export type RequestInfoExecutorNodeProps = any;

/**
 * Request info executor node component - gateway for external information requests
 */
export const RequestInfoExecutorNode = memo(({ id, data, selected }: RequestInfoExecutorNodeProps) => {
  const { handles, executor, label, description, status } = data;

  const displayLabel = label || executor.label || executor.requestType || executor.id;
  const displayDescription = description || executor.description || `Request: ${executor.requestType}`;

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
                  layoutId={`request-title-${id}`}
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
                  className="text-sm text-gray-600 truncate max-w-[120px] capitalize"
                >
                  {executor.requestType.replace("-", " ")}
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
            <span className="text-sm text-gray-400">Configure Request</span>
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
                  Request Type
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 capitalize">
                  {executor.requestType.replace("-", " ")}
                </div>
              </div>

              {executor.timeout && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Timeout
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    {executor.timeout}ms
                  </div>
                </div>
              )}

              {executor.retryPolicy && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Retry Policy
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    Max retries: {executor.retryPolicy.maxRetries}
                    {executor.retryPolicy.backoffMs && ` • Backoff: ${executor.retryPolicy.backoffMs}ms`}
                    {executor.retryPolicy.exponentialBackoff && " • Exponential"}
                  </div>
                </div>
              )}

              {executor.responseHandler && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Response Handler
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 font-mono">
                    {executor.responseHandler}
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
                <Action tooltip="Edit request info executor" label="Edit" aria-label="Edit">
                  <Pencil className="size-4" />
                </Action>
                <Action tooltip="Delete request info executor" label="Delete" aria-label="Delete">
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

RequestInfoExecutorNode.displayName = "RequestInfoExecutorNode";

