import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { AnimatedEdge } from "@/components/ai-elements/edge";

describe("AnimatedEdge reduced motion", () => {
  it("does not render animated indicators when prefers-reduced-motion is enabled", () => {
    const originalMatch = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <ReactFlowProvider>
        <svg>
          {/* @ts-expect-error test props */}
          <AnimatedEdge id="e-1" sourceX={0} sourceY={0} targetX={100} targetY={0} />
        </svg>
      </ReactFlowProvider>
    );

    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(0);

    window.matchMedia = originalMatch;
  });
});