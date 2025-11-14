import { describe, it, expect } from "vitest";
import { validateWorkflowDefinition, checkReferentialIntegrity } from "@/lib/workflow/schema/validator";

const validWorkflow = {
  id: "wf-1",
  name: "Demo",
  executors: [
    { id: "ag-1", type: "agent-executor", agentId: "agent-123", temperature: 0.5 },
    { id: "fn-1", type: "function-executor", functionName: "summarizeText" }
  ],
  edges: [
    { id: "e1", source: "ag-1", target: "fn-1", condition: { type: "always" } }
  ],
  version: "1.0.0"
};

const invalidWorkflow = {
  id: "wf-2",
  executors: [{ id: "ag-1", type: "agent-executor", temperature: 2 }], // invalid temperature
  edges: [{ id: "e1", source: "ag-1", target: "missing", condition: { type: "always" } }]
};

describe("Workflow schema validation", () => {
  it("accepts a valid workflow", () => {
    const res = validateWorkflowDefinition(validWorkflow);
    expect(res.valid).toBe(true);
  });

  it("rejects invalid fields and broken references", () => {
    const res1 = validateWorkflowDefinition(invalidWorkflow);
    expect(res1.valid).toBe(false);
    const res2 = checkReferentialIntegrity(invalidWorkflow);
    expect(res2.valid).toBe(false);
    expect(res2.errors?.some((e) => e.includes("Unknown target"))).toBe(true);
  });
});

