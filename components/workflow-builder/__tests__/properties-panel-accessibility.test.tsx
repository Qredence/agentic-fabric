import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PropertiesPanel } from "@/components/workflow-builder/properties-panel";

const sampleNode = {
  id: "node-1",
  type: "agent-executor",
  data: {
    executor: {
      id: "exec-1",
      type: "agent-executor",
      label: "New agent-executor",
      description: "Use an AI agent to process messages",
    },
    executorType: "agent-executor",
    label: "New agent-executor",
    description: "Use an AI agent to process messages",
  },
};

describe("PropertiesPanel accessibility", () => {
  it("renders as a region with labelled-by when a node is selected", () => {
    render(
      <PropertiesPanel
        selectedNode={sampleNode as any}
        onUpdate={() => {}}
      />,
    );
    const region = screen.getByRole("region");
    expect(region).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: /new agent-executor/i });
    expect(heading).toBeInTheDocument();
    const labelledBy = region.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toBe(heading);
  });

  it("renders with aria-label when no node is selected", () => {
    render(
      <PropertiesPanel selectedNode={null} onUpdate={() => {}} />,
    );
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Properties Panel");
  });
});

