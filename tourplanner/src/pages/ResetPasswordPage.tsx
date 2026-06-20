import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/ApiClient";
import AuthService from "@/services/AuthService";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Password reset token is missing.");
      return;
    }

    setSubmitting(true);
    try {
      await AuthService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reset your password. Please try again."
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
            Choose New Password
          </h1>
          <p className="mt-3 text-base text-muted-foreground/80">
            Enter a new password for your TourPlanner account.
          </p>
        </div>

        <div className="panel-soft p-7 sm:p-9">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                Your password has been reset successfully.
              </div>
              <Link
                to="/login"
                className="btn-primary inline-flex w-full justify-center py-4 text-base font-semibold shadow-sm hover:shadow-md"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2.5 block text-sm font-medium text-foreground"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={100}
                  autoComplete="new-password"
                  className="field-control placeholder-muted-foreground/50"
                  placeholder="Enter your new password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  className="field-control placeholder-muted-foreground/50"
                  placeholder="Confirm your new password"
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
                {submitting ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-7 text-center text-sm text-muted-foreground/80">
          Need a new link?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-accent transition-smooth hover:text-accent-hover"
          >
            Request another
          </Link>
        </p>
      </div>
    </div>
  );
}
