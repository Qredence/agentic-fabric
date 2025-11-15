import { describe, it, expect } from "vitest"
import { serializeTopology } from "@/lib/workflow/export/topology"

describe("serializeTopology", () => {
  it("strips executor config and preserves topology", () => {
    const workflow: any = {
      id: "wf1",
      name: "Test",
      executors: [
        { id: "e1", type: "agent-executor", label: "A", systemPrompt: "x", model: "gpt-5" },
        { id: "e2", type: "function-executor", label: "F", parameters: { a: 1 } },
      ],
      edges: [
        { id: "edge-1", source: "e1", target: "e2" },
      ],
      metadata: {},
      edgeGroups: [],
    }
    const topo = serializeTopology(workflow)
    expect(topo.executors[0]).toEqual({ id: "e1", type: "agent-executor", label: "A" })
    expect(topo.executors[1]).toEqual({ id: "e2", type: "function-executor", label: "F" })
    expect(topo.edges[0]).toEqual({ id: "edge-1", source: "e1", target: "e2" })
  })
})