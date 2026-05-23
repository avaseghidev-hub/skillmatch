import { describe, expect, it } from "vitest";
import { filterApplications, hasActiveFilters } from "./applicationFilterUtils";
import { initialApplicationFilters } from "../../../types/applicationFilters";
import type { JobApplication } from "../../../types/application";

const applications: JobApplication[] = [
  {
    id: 1,
    userId: 1,
    companyName: "Google",
    jobTitle: "Frontend Engineer",
    jobDescription: "React role",
    jobUrl: "https://google.com/jobs",
    location: "Berlin",
    status: "APPLIED",
    source: "LinkedIn",
    workMode: "Hybrid",
    notes: "",
    createdAt: "2026-01-10T10:00:00",
    updatedAt: "2026-01-12T10:00:00",
  },
  {
    id: 2,
    userId: 1,
    companyName: "Amazon",
    jobTitle: "Backend Engineer",
    jobDescription: "Java role",
    jobUrl: "https://amazon.com/jobs",
    location: "Munich",
    status: "INTERVIEW",
    source: "Company website",
    workMode: "Remote",
    notes: "",
    createdAt: "2026-02-05T10:00:00",
    updatedAt: "2026-02-07T10:00:00",
  },
];

describe("filterApplications", () => {
  it("returns all applications when no filters are active", () => {
    // Validate default filter behavior
    const result = filterApplications(applications, initialApplicationFilters);

    expect(result).toHaveLength(2);
  });

  it("filters by company name search", () => {
    // Validate search by company name
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      search: "google",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Google");
  });

  it("filters by job title search", () => {
    // Validate search by job title
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      search: "backend",
    });

    expect(result).toHaveLength(1);
    expect(result[0].jobTitle).toBe("Backend Engineer");
  });

  it("filters by status", () => {
    // Validate status filtering
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      status: "INTERVIEW",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Amazon");
  });

  it("filters by work mode", () => {
    // Validate work mode filtering
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      workMode: "Hybrid",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Google");
  });

  it("filters by location", () => {
    // Validate location filtering
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      location: "munich",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Amazon");
  });

  it("filters by created date range", () => {
    // Validate created date range filtering
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      createdFrom: "2026-02-01",
      createdTo: "2026-02-28",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Amazon");
  });

  it("filters by updated date range", () => {
    // Validate updated date range filtering
    const result = filterApplications(applications, {
      ...initialApplicationFilters,
      updatedFrom: "2026-01-01",
      updatedTo: "2026-01-31",
    });

    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Google");
  });
});

describe("hasActiveFilters", () => {
  it("returns false for initial filters", () => {
    // Validate inactive filter state
    expect(hasActiveFilters(initialApplicationFilters)).toBe(false);
  });

  it("returns true when search filter is active", () => {
    // Validate active search filter state
    expect(
      hasActiveFilters({
        ...initialApplicationFilters,
        search: "Google",
      })
    ).toBe(true);
  });

  it("returns true when date filter is active", () => {
    // Validate active date filter state
    expect(
      hasActiveFilters({
        ...initialApplicationFilters,
        createdFrom: "2026-01-01",
      })
    ).toBe(true);
  });
});