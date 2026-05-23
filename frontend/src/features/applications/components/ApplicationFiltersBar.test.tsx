import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationFiltersBar } from "./ApplicationFiltersBar";
import {
  initialApplicationFilters,
  type ApplicationFilters,
} from "../../../types/applicationFilters";

const renderFiltersBar = (
  filters: ApplicationFilters = initialApplicationFilters,
  onChange = vi.fn()
) => {
  return {
    onChange,
    ...render(<ApplicationFiltersBar filters={filters} onChange={onChange} />),
  };
};

describe("ApplicationFiltersBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter fields", () => {
    // Validate all filter controls are visible
    renderFiltersBar();

    expect(screen.getByText("Filter Applications")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Work mode")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Created from")).toBeInTheDocument();
    expect(screen.getByText("Created to")).toBeInTheDocument();
    expect(screen.getByText("Updated from")).toBeInTheDocument();
    expect(screen.getByText("Updated to")).toBeInTheDocument();
  });


  it("updates search filter when user types", () => {
    // Validate search filter change event
    const { onChange } = renderFiltersBar();

    fireEvent.change(screen.getByPlaceholderText(/company or job title/i), {
        target: { value: "Google" },
    });

    expect(onChange).toHaveBeenCalledWith({
        ...initialApplicationFilters,
        search: "Google",
    });
  });

  it("updates status filter when user selects status", async () => {
    // Validate status filter change event
    const user = userEvent.setup();
    const { onChange } = renderFiltersBar();

    await user.selectOptions(screen.getByDisplayValue("All statuses"), "APPLIED");

    expect(onChange).toHaveBeenCalledWith({
      ...initialApplicationFilters,
      status: "APPLIED",
    });
  });

  it("updates work mode filter when user selects work mode", async () => {
    // Validate work mode filter change event
    const user = userEvent.setup();
    const { onChange } = renderFiltersBar();

    await user.selectOptions(screen.getByDisplayValue("All work modes"), "Remote");

    expect(onChange).toHaveBeenCalledWith({
      ...initialApplicationFilters,
      workMode: "Remote",
    });
  });

it("updates location filter when user types", () => {
    // Validate location filter change event
    const { onChange } = renderFiltersBar();

    fireEvent.change(screen.getByPlaceholderText(/location/i), {
        target: { value: "Berlin" },
    });

    expect(onChange).toHaveBeenCalledWith({
        ...initialApplicationFilters,
        location: "Berlin",
    });
    });

  it("disables clear button when no filters are active", () => {
    // Validate disabled clear button state
    renderFiltersBar();

    expect(
      screen.getByRole("button", { name: /clear filters/i })
    ).toBeDisabled();
  });

  it("clears filters when clear button is clicked", async () => {
    // Validate reset filters action
    const user = userEvent.setup();
    const activeFilters: ApplicationFilters = {
      ...initialApplicationFilters,
      search: "Google",
      status: "APPLIED",
    };

    const { onChange } = renderFiltersBar(activeFilters);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(onChange).toHaveBeenCalledWith(initialApplicationFilters);
  });
});