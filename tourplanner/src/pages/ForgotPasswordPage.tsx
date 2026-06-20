import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "@/api/ApiClient";
import AuthService from "@/services/AuthService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const resetPath = resetUrl ? resetUrl.replace(/^https?:\/\/[^/]+/, "") : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const trimmedEmail = email.trim();
      const response = await AuthService.forgotPassword({ email: trimmedEmail });
      setSubmittedEmail(trimmedEmail);
      setResetUrl(response.data?.resetUrl ?? null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not request a password reset. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="mt-3 text-base text-muted-foreground/80">
            Enter your email address and we will help you get back in.
          </p>
        </div>

        <div className="panel-soft p-7 sm:p-9">
          {submittedEmail ? (
            <div className="space-y-6 text-center">
              <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                If an account exists for {submittedEmail}, a password reset
                link has been generated.
              </div>

              {resetPath && (
                <Link
                  to={resetPath}
                  className="block break-words rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-accent transition-smooth hover:text-accent-hover"
                >
                  Open password reset link
                </Link>
              )}

              <Link
                to="/login"
                className="btn-primary inline-flex w-full justify-center py-4 text-base font-semibold shadow-sm hover:shadow-md"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="field-control placeholder-muted-foreground/50"
                  placeholder="Enter your email address"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 text-base font-semibold shadow-sm hover:shadow-md"
              >
                {submitting ? "Requesting..." : "Request reset"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-7 text-center text-sm text-muted-foreground/80">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-accent transition-smooth hover:text-accent-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
