import { describe, expect, it } from "vitest";
import { calculateProfileCompletion } from "./profileCompletionUtils";

describe("calculateProfileCompletion", () => {
  it("returns 0% when profile is null", () => {
    // Validate null profile fallback behavior
    const result = calculateProfileCompletion(null);

    expect(result.percentage).toBe(0);

    expect(result.missingItems).toContain("Full name");
    expect(result.missingItems).toContain("Skills");
    expect(result.missingItems).toContain("Resume text");
  });

  it("returns 100% for complete profile", () => {
    // Validate fully completed profile scoring
    const result = calculateProfileCompletion({
      userId: 1,
      fullName: "Azadeh Vaseghi",
      targetRole: "Senior Full Stack Engineer",
      location: "Berlin",
      preferredWorkMode: "Remote",
      skills: "React, Spring Boot",
      languages: "English, German",
      resumeText: "Experienced software engineer",
    });

    expect(result.percentage).toBe(100);
    expect(result.missingItems).toEqual([]);
  });

  it("returns partial completion for incomplete profile", () => {
    // Validate missing field detection
    const result = calculateProfileCompletion({
      userId: 1,
      fullName: "Azadeh",
      targetRole: "",
      location: "Berlin",
      preferredWorkMode: "",
      skills: "React",
      languages: "",
      resumeText: "",
    });

    expect(result.percentage).toBe(50);

    expect(result.missingItems).toContain("Target role");
    expect(result.missingItems).toContain("Preferred work mode");
    expect(result.missingItems).toContain("Languages");
    expect(result.missingItems).toContain("Resume text");
  });

  it("ignores whitespace-only values", () => {
    // Validate trim-based empty value handling
    const result = calculateProfileCompletion({
      userId: 1,
      fullName: "   ",
      targetRole: "   ",
      location: "Berlin",
      preferredWorkMode: "Remote",
      skills: "React",
      languages: "English",
      resumeText: "Resume",
    });

    expect(result.percentage).toBe(70);

    expect(result.missingItems).toContain("Full name");
    expect(result.missingItems).toContain("Target role");
  });
});