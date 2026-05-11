import { useState } from "react";
import type { FormEvent } from "react";
import { register } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Spinner } from "../../../components/ui/Spinner";

type RegisterPageProps = {
  onShowLogin: () => void;
};

export const RegisterPage = ({ onShowLogin }: RegisterPageProps) => {
  const { loginUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Register a new user and save auth data.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const response = await register({
        name,
        email,
        password,
      });

      loginUser({
        token: response.token,
        userId: response.userId,
        name: response.name,
        email: response.email,
      });
    } catch (error) {
      console.error("Register failed", error);
      setError("Registration failed. Please check your information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6 text-[var(--foreground)]">
      <Card className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">Create account</h1>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Register to start tracking your job applications.
          </p>

          <div className="mt-6 space-y-4">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />

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
              minLength={6}
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onShowLogin}
              className="font-semibold text-[var(--primary)]"
            >
              Sign in
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};