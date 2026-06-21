import { useEffect, useState } from "react";
import { User, Mail, Calendar, Lock, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useProfileViewModel } from "@/viewmodels/useProfileViewModel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
        <Card variant="elevated" padding="lg" className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load profile</h2>
          <p className="text-sm text-muted-foreground/80">Please try refreshing the page or logging out and back in.</p>
          <Button onClick={loadProfile} className="mt-6">
            Retry
          </Button>
        </Card>
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
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-accent" />
            Personal Information
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <Input
              id="username"
              label="Username"
              type="text"
              value={profileForm.username}
              onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))}
              leftIcon={<User className="h-4 w-4" />}
              required
              minLength={3}
              maxLength={50}
            />

            <Input
              id="email"
              label="Email Address"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
              leftIcon={<Mail className="h-4 w-4" />}
              required
              maxLength={255}
            />

            {/* Registration Date (read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {profile.registrationDate
                    ? new Date(profile.registrationDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={updating}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* ─── SECTION: Change Password ──────────────────────────────── */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-6">
            <Lock className="h-5 w-5 text-accent" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Input
              id="current-password"
              label="Current Password"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
              leftIcon={<Key className="h-4 w-4" />}
              required
              minLength={1}
            />

            <Input
              id="new-password"
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              leftIcon={<Lock className="h-4 w-4" />}
              hint="Must be at least 8 characters."
              required
              minLength={8}
              maxLength={100}
            />

            <Input
              id="confirm-password"
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              leftIcon={<Lock className="h-4 w-4" />}
              required
              minLength={8}
              maxLength={100}
            />

            {/* Password mismatch immediate feedback */}
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
              <Button
                type="submit"
                loading={updating}
                disabled={!passwordForm.oldPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}