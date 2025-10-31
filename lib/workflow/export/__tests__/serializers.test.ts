import { describe, it, expect } from "vitest";
import {
  serializeToJSON,
  serializeToYAML,
  deserializeFromJSON,
  deserializeFromYAML,
} from "../serializers";
import type { Workflow } from "../../workflow";

describe("Workflow Serializers", () => {
  const sampleWorkflow: Workflow = {
    id: "workflow-1",
    name: "Test Workflow",
    description: "A test workflow",
    executors: [
      {
        id: "executor-1",
        type: "executor",
        label: "Test Executor",
        description: "A test executor",
      },
      {
        id: "executor-2",
        type: "agent-executor",
        label: "Test Agent",
        agentId: "agent-1",
      } as any,
    ],
    edges: [
      {
        id: "edge-1",
        source: "executor-1",
        target: "executor-2",
        condition: {
          type: "predicate",
          expression: "message.type === 'chat'",
        },
      },
    ],
    metadata: {
      author: "Test User",
      createdAt: "2024-01-01T00:00:00Z",
    },
  };

  describe("serializeToJSON", () => {
    it("should serialize workflow to JSON", () => {
      const json = serializeToJSON(sampleWorkflow);
      expect(json).toContain("workflow-1");
      expect(json).toContain("Test Workflow");
      expect(json).toContain("executor-1");
    });

    it("should serialize with pretty formatting", () => {
      const json = serializeToJSON(sampleWorkflow, true);
      expect(json).toContain("\n");
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe("workflow-1");
    });

    it("should serialize without pretty formatting", () => {
      const json = serializeToJSON(sampleWorkflow, false);
      expect(json).not.toContain("\n  ");
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe("workflow-1");
    });
  });

  describe("serializeToYAML", () => {
    it("should serialize workflow to YAML", () => {
      const yaml = serializeToYAML(sampleWorkflow);
      expect(yaml).toContain("workflow-1");
      expect(yaml).toContain("Test Workflow");
    });
  });

  describe("deserializeFromJSON", () => {
    it("should deserialize JSON to workflow", () => {
      const json = serializeToJSON(sampleWorkflow);
      const workflow = deserializeFromJSON(json);

      expect(workflow.id).toBe("workflow-1");
      expect(workflow.name).toBe("Test Workflow");
      expect(workflow.executors).toHaveLength(2);
      expect(workflow.edges).toHaveLength(1);
    });

    it("should preserve executor properties", () => {
      const json = serializeToJSON(sampleWorkflow);
      const workflow = deserializeFromJSON(json);

      expect(workflow.executors[0].label).toBe("Test Executor");
      expect(workflow.executors[0].description).toBe("A test executor");
    });

    it("should preserve edge conditions", () => {
      const json = serializeToJSON(sampleWorkflow);
      const workflow = deserializeFromJSON(json);

      expect(workflow.edges[0].condition).toBeDefined();
      expect(workflow.edges[0].condition?.type).toBe("predicate");
      expect(workflow.edges[0].condition?.expression).toBe("message.type === 'chat'");
    });

    it("should preserve metadata", () => {
      const json = serializeToJSON(sampleWorkflow);
      const workflow = deserializeFromJSON(json);

      expect(workflow.metadata?.author).toBe("Test User");
    });
  });

  describe("deserializeFromYAML", () => {
    it("should deserialize YAML to workflow", () => {
      const yaml = serializeToYAML(sampleWorkflow);
      const workflow = deserializeFromYAML(yaml);

      expect(workflow.id).toBe("workflow-1");
      expect(workflow.name).toBe("Test Workflow");
      expect(workflow.executors).toHaveLength(2);
    });
  });

  describe("Round-trip serialization", () => {
    it("should maintain workflow structure through JSON round-trip", () => {
      const json = serializeToJSON(sampleWorkflow);
      const workflow = deserializeFromJSON(json);
      const json2 = serializeToJSON(workflow);
      const workflow2 = deserializeFromJSON(json2);

      expect(workflow2.id).toBe(sampleWorkflow.id);
      expect(workflow2.executors).toHaveLength(sampleWorkflow.executors.length);
      expect(workflow2.edges).toHaveLength(sampleWorkflow.edges.length);
    });

    it("should maintain workflow structure through YAML round-trip", () => {
      const yaml = serializeToYAML(sampleWorkflow);
      const workflow = deserializeFromYAML(yaml);
      const yaml2 = serializeToYAML(workflow);
      const workflow2 = deserializeFromYAML(yaml2);

      expect(workflow2.id).toBe(sampleWorkflow.id);
      expect(workflow2.executors).toHaveLength(sampleWorkflow.executors.length);
    });
  });
});

