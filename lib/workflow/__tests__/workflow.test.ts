import { describe, it, expect } from "vitest";
import {
  createWorkflowBuilder,
  validateWorkflow,
  workflowDefinitionToWorkflow,
} from "../workflow";
import type { BaseExecutor } from "../types";

describe("Workflow Builder and Validation", () => {
  describe("createWorkflowBuilder", () => {
    it("should create a workflow builder", () => {
      const builder = createWorkflowBuilder("workflow-1", "Test Workflow");
      expect(builder.workflow.id).toBe("workflow-1");
      expect(builder.workflow.name).toBe("Test Workflow");
    });

    it("should add executors to workflow", () => {
      const builder = createWorkflowBuilder("workflow-1");
      const executor: BaseExecutor = {
        id: "executor-1",
        type: "executor",
        label: "Test Executor",
      };

      builder.addExecutor(executor);
      expect(builder.workflow.executors).toHaveLength(1);
      expect(builder.workflow.executors[0].id).toBe("executor-1");
    });

    it("should add multiple executors", () => {
      const builder = createWorkflowBuilder("workflow-1");
      const executors: BaseExecutor[] = [
        { id: "executor-1", type: "executor" },
        { id: "executor-2", type: "executor" },
      ];

      builder.addExecutors(executors);
      expect(builder.workflow.executors).toHaveLength(2);
    });

    it("should add edges to workflow", () => {
      const builder = createWorkflowBuilder("workflow-1");
      builder.addEdge("executor-1", "executor-2");
      expect(builder.workflow.edges).toHaveLength(1);
      expect(builder.workflow.edges[0].source).toBe("executor-1");
      expect(builder.workflow.edges[0].target).toBe("executor-2");
    });

    it("should add edges with conditions", () => {
      const builder = createWorkflowBuilder("workflow-1");
      builder.addEdge("executor-1", "executor-2", {
        type: "predicate",
        expression: "message.type === 'error'",
      });
      expect(builder.workflow.edges[0].condition).toBeDefined();
      expect(builder.workflow.edges[0].condition?.type).toBe("predicate");
    });

    it("should build a complete workflow", () => {
      const workflow = createWorkflowBuilder("workflow-1", "Test")
        .addExecutor({ id: "executor-1", type: "executor" })
        .addExecutor({ id: "executor-2", type: "executor" })
        .addEdge("executor-1", "executor-2")
        .setMetadata({ author: "Test User" })
        .build();

      expect(workflow.id).toBe("workflow-1");
      expect(workflow.executors).toHaveLength(2);
      expect(workflow.edges).toHaveLength(1);
      expect(workflow.metadata?.author).toBe("Test User");
    });
  });

  describe("validateWorkflow", () => {
    it("should validate a valid workflow", () => {
      const workflow = {
        id: "workflow-1",
        executors: [
          { id: "executor-1", type: "executor" },
          { id: "executor-2", type: "executor" },
        ],
        edges: [
          { id: "edge-1", source: "executor-1", target: "executor-2" },
        ],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect duplicate executor IDs", () => {
      const workflow = {
        id: "workflow-1",
        executors: [
          { id: "executor-1", type: "executor" },
          { id: "executor-1", type: "executor" }, // Duplicate
        ],
        edges: [],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "duplicate-executor-id")).toBe(true);
    });

    it("should detect duplicate edge IDs", () => {
      const workflow = {
        id: "workflow-1",
        executors: [
          { id: "executor-1", type: "executor" },
          { id: "executor-2", type: "executor" },
        ],
        edges: [
          { id: "edge-1", source: "executor-1", target: "executor-2" },
          { id: "edge-1", source: "executor-2", target: "executor-1" }, // Duplicate
        ],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "duplicate-edge-id")).toBe(true);
    });

    it("should detect invalid edge sources", () => {
      const workflow = {
        id: "workflow-1",
        executors: [{ id: "executor-1", type: "executor" }],
        edges: [
          { id: "edge-1", source: "nonexistent", target: "executor-1" },
        ],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "invalid-edge-source")).toBe(true);
    });

    it("should detect invalid edge targets", () => {
      const workflow = {
        id: "workflow-1",
        executors: [{ id: "executor-1", type: "executor" }],
        edges: [
          { id: "edge-1", source: "executor-1", target: "nonexistent" },
        ],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "invalid-edge-target")).toBe(true);
    });

    it("should warn about orphaned executors", () => {
      const workflow = {
        id: "workflow-1",
        executors: [
          { id: "executor-1", type: "executor" },
          { id: "executor-2", type: "executor" }, // Orphaned
        ],
        edges: [
          { id: "edge-1", source: "executor-1", target: "executor-1" },
        ],
      };

      const result = validateWorkflow(workflow as any);
      expect(result.warnings.some((w) => w.code === "orphaned-executor")).toBe(true);
    });
  });

  describe("workflowDefinitionToWorkflow", () => {
    it("should convert workflow definition to workflow", () => {
      const definition = {
        id: "workflow-1",
        name: "Test Workflow",
        executors: [{ id: "executor-1", type: "executor" }],
        edges: [
          {
            id: "edge-1",
            source: "executor-1",
            target: "executor-1",
            condition: {
              type: "predicate" as const,
              expression: "true",
            },
          },
        ],
      };

      const workflow = workflowDefinitionToWorkflow(definition);
      expect(workflow.id).toBe("workflow-1");
      expect(workflow.name).toBe("Test Workflow");
      expect(workflow.executors).toHaveLength(1);
      expect(workflow.edges).toHaveLength(1);
      expect(workflow.edges[0].condition?.type).toBe("predicate");
    });
  });
});
