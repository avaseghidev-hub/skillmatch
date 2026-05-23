import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { LoginPage } from "./LoginPage";
import { AuthProvider } from "../context/AuthContext";
import { login } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  login: vi.fn(),
}));

const renderLoginPage = () => {
  return render(
    <AuthProvider>
      <LoginPage onShowRegister={vi.fn()} />
    </AuthProvider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("allows user to type email and password", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");

    expect(screen.getByPlaceholderText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue("password123");
  });

  it("logs in successfully and saves auth data", async () => {
    const user = userEvent.setup();

    vi.mocked(login).mockResolvedValue({
      userId: 1,
      name: "Test User",
      email: "test@example.com",
      token: "fake-jwt-token",
      message: "Login successful",
    });

    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(localStorage.getItem("user")).toContain("Test User");
  });

  it("shows error message when login fails", async () => {
    const user = userEvent.setup();

    vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/email/i), "wrong@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/login failed/i)
    ).toBeInTheDocument();
  });
});