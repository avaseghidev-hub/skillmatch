import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileCompletionCard } from "./ProfileCompletionCard";

describe("ProfileCompletionCard", () => {
  it("renders 0% and missing items when profile is null", () => {
    // Validate empty profile UI state
    render(<ProfileCompletionCard profile={null} />);

    expect(screen.getByText("Profile Completion")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Missing information:")).toBeInTheDocument();
    expect(screen.getByText("Full name")).toBeInTheDocument();
    expect(screen.getByText("Resume text")).toBeInTheDocument();
  });

  it("renders completed message for 100% profile", () => {
    // Validate completed profile UI state
    render(
      <ProfileCompletionCard
        profile={{
          userId: 1,
          fullName: "Azadeh Vaseghi",
          targetRole: "Senior Full Stack Engineer",
          location: "Berlin",
          preferredWorkMode: "Remote",
          skills: "React, Spring Boot",
          languages: "English, German",
          resumeText: "Experienced software engineer",
        }}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your profile is complete and ready for AI-powered job matching."
      )
    ).toBeInTheDocument();

    expect(screen.queryByText("Missing information:")).not.toBeInTheDocument();
  });

  it("renders incomplete message and missing fields", () => {
    // Validate partial profile UI state
    render(
      <ProfileCompletionCard
        profile={{
          userId: 1,
          fullName: "Azadeh",
          targetRole: "",
          location: "Berlin",
          preferredWorkMode: "",
          skills: "React",
          languages: "",
          resumeText: "",
        }}
      />
    );

    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Complete your profile to improve resume and job matching accuracy."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Target role")).toBeInTheDocument();
    expect(screen.getByText("Preferred work mode")).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Resume text")).toBeInTheDocument();
  });

  it("sets progress bar width based on completion percentage", () => {
    // Validate visual progress width
    render(
      <ProfileCompletionCard
        profile={{
          userId: 1,
          fullName: "Azadeh",
          targetRole: "",
          location: "Berlin",
          preferredWorkMode: "",
          skills: "React",
          languages: "",
          resumeText: "",
        }}
      />
    );

    const progressBar = screen.getByText("50%")
      .closest("div")
      ?.parentElement
      ?.querySelector('[style*="width: 50%"]');

    expect(progressBar).toBeInTheDocument();
  });
});