import { describe, expect, it } from "vitest";
import {
  getScoreColorClass,
  getScoreLabel,
  getScoreTextColorClass,
  splitSkills,
} from "./skillMatchUtils";

describe("splitSkills", () => {
  it("returns empty array when skills are missing", () => {
    // Validate empty skills fallback
    expect(splitSkills()).toEqual([]);
    expect(splitSkills("")).toEqual([]);
  });

  it("splits comma-separated skills and trims spaces", () => {
    // Validate skill normalization
    expect(splitSkills("React, TypeScript, Spring Boot")).toEqual([
      "React",
      "TypeScript",
      "Spring Boot",
    ]);
  });

  it("removes empty skill values", () => {
    // Validate empty entry cleanup
    expect(splitSkills("React, , TypeScript,  , Java")).toEqual([
      "React",
      "TypeScript",
      "Java",
    ]);
  });
});

describe("getScoreLabel", () => {
  it("returns Strong Match for scores 80 and above", () => {
    // Validate strong score label boundary
    expect(getScoreLabel(80)).toBe("Strong Match");
    expect(getScoreLabel(95)).toBe("Strong Match");
  });

  it("returns Medium Match for scores between 50 and 79", () => {
    // Validate medium score label boundary
    expect(getScoreLabel(50)).toBe("Medium Match");
    expect(getScoreLabel(79)).toBe("Medium Match");
  });

  it("returns Low Match for scores below 50", () => {
    // Validate low score label boundary
    expect(getScoreLabel(49)).toBe("Low Match");
  });
});

describe("score color helpers", () => {
  it("returns correct progress bar color classes", () => {
    // Validate score progress color mapping
    expect(getScoreColorClass(80)).toBe("bg-green-500");
    expect(getScoreColorClass(50)).toBe("bg-yellow-500");
    expect(getScoreColorClass(20)).toBe("bg-red-500");
  });

  it("returns correct score text color classes", () => {
    // Validate score text color mapping
    expect(getScoreTextColorClass(80)).toBe("text-green-600");
    expect(getScoreTextColorClass(50)).toBe("text-yellow-600");
    expect(getScoreTextColorClass(20)).toBe("text-red-600");
  });
});