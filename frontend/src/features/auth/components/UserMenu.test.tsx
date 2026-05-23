import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "./UserMenu";

describe("UserMenu", () => {
  it("renders user name, email and initials", () => {
    // Validate collapsed user menu trigger
    render(
      <UserMenu
        name="Azadeh Vaseghi"
        email="azadeh@example.com"
        onProfileClick={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByText("AV")).toBeInTheDocument();
    expect(screen.getByText("Azadeh Vaseghi")).toBeInTheDocument();
    expect(screen.getByText("azadeh@example.com")).toBeInTheDocument();
  });

  it("opens menu when trigger is clicked", async () => {
    // Validate dropdown open behavior
    const user = userEvent.setup();

    render(
      <UserMenu
        name="Azadeh Vaseghi"
        email="azadeh@example.com"
        onProfileClick={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("View / Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls profile callback when profile item is clicked", async () => {
    // Validate profile action callback
    const user = userEvent.setup();
    const onProfileClick = vi.fn();

    render(
      <UserMenu
        name="Azadeh Vaseghi"
        email="azadeh@example.com"
        onProfileClick={onProfileClick}
        onLogout={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("View / Edit Profile"));

    expect(onProfileClick).toHaveBeenCalledTimes(1);
  });

  it("calls logout callback when logout item is clicked", async () => {
    // Validate logout action callback
    const user = userEvent.setup();
    const onLogout = vi.fn();

    render(
      <UserMenu
        name="Azadeh Vaseghi"
        email="azadeh@example.com"
        onProfileClick={vi.fn()}
        onLogout={onLogout}
      />
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Logout"));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("renders fallback user information when name and email are missing", () => {
    // Validate fallback display values
    render(
      <UserMenu
        onProfileClick={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});