import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/ApiClient";
import AuthService from "@/services/AuthService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

        <Card variant="elevated" padding="lg">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                Your password has been reset successfully.
              </div>
              <Link to="/login">
                <Button className="w-full" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="newPassword"
                label="New password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                maxLength={100}
                autoComplete="new-password"
                placeholder="Enter your new password"
              />

              <Input
                id="confirmPassword"
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
                placeholder="Confirm your new password"
              />

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          )}
        </Card>

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
