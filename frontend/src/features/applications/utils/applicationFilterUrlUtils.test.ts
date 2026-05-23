import { beforeEach, describe, expect, it } from "vitest";
import {
  getFiltersFromUrl,
  syncFiltersToUrl,
} from "./applicationFilterUrlUtils";
import { initialApplicationFilters } from "../../../types/applicationFilters";

describe("getFiltersFromUrl", () => {
  beforeEach(() => {
    // Reset browser URL before each test
    window.history.replaceState(null, "", "/");
  });

  it("returns initial filters when URL is empty", () => {
    // Validate empty URL behavior
    const result = getFiltersFromUrl();

    expect(result).toEqual(initialApplicationFilters);
  });

  it("reads filters from URL query params", () => {
    // Validate URL query parsing
    window.history.replaceState(
      null,
      "",
      "/?search=react&status=APPLIED&location=Berlin"
    );

    const result = getFiltersFromUrl();

    expect(result.search).toBe("react");
    expect(result.status).toBe("APPLIED");
    expect(result.location).toBe("Berlin");
  });

  it("returns default values for missing params", () => {
    // Validate fallback values
    window.history.replaceState(null, "", "/?search=java");

    const result = getFiltersFromUrl();

    expect(result.search).toBe("java");
    expect(result.status).toBe("");
    expect(result.location).toBe("");
  });
});

describe("syncFiltersToUrl", () => {
  beforeEach(() => {
    // Reset browser URL before each test
    window.history.replaceState(null, "", "/");
  });

  it("adds active filters to URL", () => {
    // Validate URL synchronization
    syncFiltersToUrl({
      ...initialApplicationFilters,
      search: "react",
      status: "INTERVIEW",
      location: "Berlin",
    });

    expect(window.location.search).toContain("search=react");
    expect(window.location.search).toContain("status=INTERVIEW");
    expect(window.location.search).toContain("location=Berlin");
  });

  it("removes empty filters from URL", () => {
    // Validate cleanup of empty filters
    syncFiltersToUrl(initialApplicationFilters);

    expect(window.location.search).toBe("");
  });

  it("updates URL with date filters", () => {
    // Validate date filter synchronization
    syncFiltersToUrl({
      ...initialApplicationFilters,
      createdFrom: "2026-01-01",
      updatedTo: "2026-12-31",
    });

    expect(window.location.search).toContain(
      "createdFrom=2026-01-01"
    );

    expect(window.location.search).toContain(
      "updatedTo=2026-12-31"
    );
  });
});