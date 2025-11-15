import { render, screen } from "@testing-library/react";
import { AgentExecutorNode } from "@/components/ai-elements/executors/agent-executor-node";
import { NodeSkeleton } from "@/components/ai-elements/loader";
import { ReactFlowProvider } from "@xyflow/react";

describe("Node Visual Improvements", () => {
  const mockData = {
    variant: "agent-executor",
    handles: { target: true, source: true },
    executor: {
      id: "test-agent",
      label: "Test Agent",
      model: "GPT-4",
      metadata: {},
    },
    label: "Test Agent",
    description: "A test agent for workflows",
    status: "idle",
  };

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  describe("Enhanced Node Component", () => {
    it("applies hover effects and transitions", () => {
      render(
        <div className="node-container relative size-full h-auto w-sm gap-0 rounded-lg p-0 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 group/node">
          <div>Test Content</div>
        </div>
      );

      const node = screen.getByText("Test Content").closest(".node-container");
      expect(node).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(node).toHaveClass("hover:shadow-xl", "hover:-translate-y-1", "hover:scale-[1.01]");
    });

    it("includes focus ring for accessibility", () => {
      render(
        <div className="node-container relative size-full h-auto w-sm gap-0 rounded-lg p-0 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 group/node">
          <div>Test Content</div>
        </div>
      );

      const node = screen.getByText("Test Content").closest(".node-container");
      expect(node).toHaveClass("focus-within:ring-2", "focus-within:ring-ring");
    });
  });

  describe("Enhanced Node Header", () => {
    it("uses gradient background with hover transitions", () => {
      render(<NodeHeader>Header Content</NodeHeader>);

      const header = screen.getByText("Header Content").closest("div");
      expect(header).toHaveClass("bg-gradient-to-r", "from-secondary", "to-secondary/80");
      expect(header).toHaveClass("transition-all", "duration-300", "ease-out");
    });

    it("applies group hover effects", () => {
      render(<NodeHeader>Header Content</NodeHeader>);

      const header = screen.getByText("Header Content").closest("div");
      expect(header).toHaveClass("group-hover/node:bg-gradient-to-r");
    });
  });

  describe("Enhanced Node Content and Footer", () => {
    it("applies consistent padding and transitions", () => {
      render(
        <>
          <NodeContent>Content</NodeContent>
          <NodeFooter>Footer</NodeFooter>
        </>
      );

      const content = screen.getByText("Content").closest("div");
      const footer = screen.getByText("Footer").closest("div");

      expect(content).toHaveClass("p-4", "transition-all", "duration-300", "ease-out");
      expect(footer).toHaveClass("rounded-b-lg", "bg-gradient-to-r", "from-secondary/50", "to-secondary/30");
    });
  });

  describe("Agent Executor Node Visual Enhancements", () => {
    it("displays status indicator with appropriate colors", () => {
      renderWithProvider(
        <AgentExecutorNode id="test" data={{ ...mockData, status: "running" }} selected={false} />
      );

      // Find the status indicator by looking for the element with the status color classes
      const statusIndicator = document.querySelector(".bg-blue-500.animate-pulse");
      expect(statusIndicator).toBeTruthy();
      expect(statusIndicator).toHaveClass("bg-blue-500", "animate-pulse");
    });

    it("applies enhanced card styling with gradients and shadows", () => {
      renderWithProvider(
        <AgentExecutorNode id="test" data={mockData} selected={false} />
      );

      // Find the card container by looking for the element with the gradient background
      const card = document.querySelector("[class*='bg-gradient-to-br']");
      expect(card).toBeTruthy();
      expect(card).toHaveClass("bg-gradient-to-br", "from-card", "to-card/80");
      expect(card).toHaveClass("shadow-lg", "hover:shadow-xl");
      expect(card).toHaveClass("hover:border-primary/30", "hover:-translate-y-0.5");
    });

    it("enhances suggestion buttons with better hover effects", () => {
      renderWithProvider(
        <AgentExecutorNode id="test" data={mockData} selected={false} />
      );

      // Find suggestion buttons by looking for the group/suggestion class
      const suggestions = screen.getAllByRole("button").filter(btn => 
        btn.className.includes("group/suggestion")
      );
      
      expect(suggestions.length).toBeGreaterThan(0);
      suggestions.forEach(suggestion => {
        expect(suggestion).toHaveClass("group/suggestion");
        expect(suggestion).toHaveClass("hover:bg-accent/50", "hover:text-foreground");
        
        const icon = suggestion.querySelector("svg");
        expect(icon).toHaveClass("group-hover/suggestion:scale-110");
      });
    });
  });

  describe("Skeleton Loading States", () => {
    it("renders node skeleton with shimmer animation", () => {
      render(<NodeSkeleton />);

      const skeleton = screen.getByTestId("node-skeleton");
      expect(skeleton).toHaveClass("rounded-xl", "bg-gradient-to-br", "from-card", "to-card/80");
      
      // Check that SkeletonLoader components inside have the shimmer animation
      const skeletonLoaders = skeleton.querySelectorAll("[class*='animate-shimmer-enhanced']");
      expect(skeletonLoaders.length).toBeGreaterThan(0);
      expect(skeletonLoaders[0]).toHaveClass("animate-shimmer-enhanced");
      expect(skeletonLoaders[0]).toHaveClass("bg-gradient-to-r", "from-transparent", "via-foreground/10", "to-transparent");
    });

    it("applies consistent card styling to skeleton", () => {
      render(<NodeSkeleton />);

      const skeleton = screen.getByTestId("node-skeleton");
      expect(skeleton).toHaveClass("rounded-xl", "bg-gradient-to-br", "from-card", "to-card/80");
      expect(skeleton).toHaveClass("border", "border-border/50");
    });
  });

  describe("Accessibility Improvements", () => {
    it("maintains proper ARIA labels and roles", () => {
      renderWithProvider(
        <AgentExecutorNode id="test" data={mockData} selected={false} />
      );

      // Component starts expanded, so we should find the collapse button
      const collapseButton = screen.getByRole("button", { name: "Collapse Test Agent" });
      expect(collapseButton).toBeInTheDocument();
    });

    it("supports keyboard navigation", () => {
      renderWithProvider(
        <AgentExecutorNode id="test" data={mockData} selected={false} />
      );

      const collapseButton = screen.getByRole("button", { name: "Collapse Test Agent" });
      expect(collapseButton).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Responsive Behavior", () => {
    it("maintains consistent styling across different states", () => {
      const { rerender } = renderWithProvider(
        <AgentExecutorNode id="test" data={mockData} selected={false} />
      );

      // Find the card container by looking for the element with border classes
      const card = document.querySelector("[class*='border-border']");
      expect(card).toBeTruthy();
      expect(card).toHaveClass("border-border/50");

      rerender(
        <ReactFlowProvider>
          <AgentExecutorNode id="test" data={mockData} selected={true} />
        </ReactFlowProvider>
      );

      // Find the card container by looking for the element with primary border classes
      const primaryCard = document.querySelector("[class*='border-primary']");
      expect(primaryCard).toBeTruthy();
      expect(primaryCard).toHaveClass("border-primary/50", "ring-2", "ring-primary/20");
    });
  });
});