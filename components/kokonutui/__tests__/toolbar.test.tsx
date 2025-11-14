import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toolbar } from "@/components/kokonutui/toolbar";

describe("Kokonut Toolbar", () => {
  it("renders only Select and Move when visibleItems provided", () => {
    render(<Toolbar visibleItems={["select", "move"]} />);
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /move/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /appearance/i })).toBeNull();
  });

  it("invokes onItemSelect with selected id", () => {
    const onItemSelect = vi.fn();
    render(<Toolbar visibleItems={["select", "move"]} onItemSelect={onItemSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /move/i }));
    expect(onItemSelect).toHaveBeenCalledWith("move");
  });

  it("filters deprecated items by default", () => {
    render(<Toolbar />);
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /move/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /notifications/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /appearance/i })).toBeNull();
  });
});

