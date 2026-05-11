import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Spinner } from "../../../components/ui/Spinner";
import { login } from "../api/authApi";

type LoginPageProps = {
  onShowRegister: () => void;
};

export const LoginPage = ({ onShowRegister }: LoginPageProps) => {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Login user and save auth data.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const response = await login({ email, password });

      loginUser({
        token: response.token,
        userId: response.userId,
        name: response.name,
        email: response.email,
      });
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6 text-[var(--foreground)]">
      <Card className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">Sign in</h1>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Login to manage your job applications.
          </p>

          <div className="mt-6 space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onShowRegister}
              className="font-semibold text-[var(--primary)]"
            >
              Create account
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};  
