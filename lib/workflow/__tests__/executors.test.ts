import { describe, it, expect } from "vitest";
import {
  isFunctionExecutor,
  isWorkflowExecutor,
  isAgentExecutor,
  isRequestInfoExecutor,
  getExecutorTypeLabel,
  getExecutorTypeDescription,
} from "../executors";
import type {
  FunctionExecutor,
  WorkflowExecutor,
  AgentExecutor,
  RequestInfoExecutor,
} from "../executors";

describe("Executor Utilities", () => {
  describe("Type Guards", () => {
    it("should identify function executors", () => {
      const executor: FunctionExecutor = {
        id: "func-1",
        type: "function-executor",
        functionName: "test",
      } as FunctionExecutor;
      expect(isFunctionExecutor(executor)).toBe(true);
    });

    it("should identify workflow executors", () => {
      const executor: WorkflowExecutor = {
        id: "workflow-1",
        type: "workflow-executor",
        workflowId: "nested-1",
      };
      expect(isWorkflowExecutor(executor)).toBe(true);
    });

    it("should identify agent executors", () => {
      const executor: AgentExecutor = {
        id: "agent-1",
        type: "agent-executor",
        agentId: "agent-1",
      };
      expect(isAgentExecutor(executor)).toBe(true);
    });

    it("should identify request-info executors", () => {
      const executor: RequestInfoExecutor = {
        id: "req-1",
        type: "request-info-executor",
        requestType: "user-input",
      };
      expect(isRequestInfoExecutor(executor)).toBe(true);
    });
  });

  describe("getExecutorTypeLabel", () => {
    it("should return correct labels for all executor types", () => {
      expect(getExecutorTypeLabel("executor")).toBe("Executor");
      expect(getExecutorTypeLabel("function-executor")).toBe("Function");
      expect(getExecutorTypeLabel("agent-executor")).toBe("Agent");
      expect(getExecutorTypeLabel("workflow-executor")).toBe("Nested Workflow");
      expect(getExecutorTypeLabel("request-info-executor")).toBe("Request Info");
    });
  });

  describe("getExecutorTypeDescription", () => {
    it("should return correct descriptions for all executor types", () => {
      expect(getExecutorTypeDescription("executor")).toContain("Base executor");
      expect(getExecutorTypeDescription("function-executor")).toContain("Execute a function");
      expect(getExecutorTypeDescription("agent-executor")).toContain("AI agent");
      expect(getExecutorTypeDescription("workflow-executor")).toContain("Nest another workflow");
    });
  });
});

