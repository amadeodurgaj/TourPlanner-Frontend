import { useEffect, useState } from "react";
import { User, Mail, Calendar, Lock, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useProfileViewModel } from "@/viewmodels/useProfileViewModel";

export default function ProfilePage() {
  const { state, actions } = useProfileViewModel();
  const { profile, loading, updating, error, success } = state;
  const { loadProfile, updateProfile, changePassword, clearMessages } = actions;

  // ─── Form State ──────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ─── Load profile on mount ──────────────────────────────────────────
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ─── Sync form fields when profile loads ────────────────────────────
  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile]);

  // ─── Clear messages after delay ─────────────────────────────────────
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
    // If update succeeds, the ViewModel updates profile state,
    // and the form will sync via the useEffect above.
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await changePassword(passwordForm);
    if (success) {
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner-md border-t-accent" />
          <p className="text-sm text-muted-foreground/80">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ─── Error / No Profile ─────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
        <div className="panel-soft max-w-md px-8 py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load profile</h2>
          <p className="text-sm text-muted-foreground/80">Please try refreshing the page or logging out and back in.</p>
          <button
            onClick={loadProfile}
            className="btn-primary mt-6"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="mt-2 text-base text-muted-foreground/80">
            Manage your account details and password
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
          <User className="h-6 w-6 text-accent" />
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div
          className={`mb-6 rounded-xl px-5 py-4 text-sm ring-1 ${
            error
              ? "border-destructive/30 bg-destructive/10 text-destructive ring-destructive/30"
              : "border-success/30 bg-success/10 text-success ring-success/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <span>{error || success}</span>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {/* ─── SECTION: Profile Information ──────────────────────────── */}
        <div className="panel-soft p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-accent" />
            Personal Information
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))}
                  className="field-control pl-10"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  className="field-control pl-10"
                  required
                  maxLength={255}
                />
              </div>
            </div>

            {/* Registration Date (read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(profile.registrationDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary px-6 py-2.5 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {updating ? (
                  <span className="spinner-sm border-t-accent-foreground mr-2" />
                ) : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* ─── SECTION: Change Password ──────────────────────────────── */}
        <div className="panel-soft p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-6">
            <Lock className="h-5 w-5 text-accent" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-foreground mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  id="current-password"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                  className="field-control pl-10"
                  required
                  minLength={1}
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  className="field-control pl-10"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground/70">Must be at least 8 characters.</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  className="field-control pl-10"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Password mismatch immediate feedback (optional) */}
            {passwordForm.newPassword &&
              passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Passwords do not match
                </div>
              )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating || !passwordForm.oldPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="btn-primary px-6 py-2.5 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {updating ? (
                  <span className="spinner-sm border-t-accent-foreground mr-2" />
                ) : null}
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}