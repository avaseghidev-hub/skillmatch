import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "./RegisterPage";
import { AuthProvider } from "../context/AuthContext";
import { register } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  register: vi.fn(),
}));

const renderRegisterPage = () => {
  return render(
    <AuthProvider>
      <RegisterPage onShowLogin={vi.fn()} />
    </AuthProvider>
  );
};

describe("RegisterPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders register form", () => {
    renderRegisterPage();

    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("allows user to type name, email and password", async () => {
    const user = userEvent.setup();

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");

    expect(screen.getByPlaceholderText(/full name/i)).toHaveValue("Test User");
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue("password123");
  });

  it("registers successfully and saves auth data", async () => {
    const user = userEvent.setup();

    vi.mocked(register).mockResolvedValue({
      userId: 1,
      name: "Test User",
      email: "test@example.com",
      token: "fake-register-token",
      message: "Registration successful",
    });

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(localStorage.getItem("token")).toBe("fake-register-token");
    expect(localStorage.getItem("user")).toContain("Test User");
  });

  it("shows error message when registration fails", async () => {
    const user = userEvent.setup();

    vi.mocked(register).mockRejectedValue(new Error("Registration failed"));

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });
});