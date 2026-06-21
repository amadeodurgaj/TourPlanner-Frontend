import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);
    if (success) {
      toast.success(`Welcome back, ${username}!`);
      navigate("/dashboard");
    } else {
      toast.error(authError || "Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header - Enhanced with better spacing and visual hierarchy */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-3 text-base text-muted-foreground/80">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form Card - Enhanced with better shadow and padding */}
        <div className="panel-soft p-7 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground mb-2.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="field-control placeholder-muted-foreground/50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="field-control placeholder-muted-foreground/50"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground/80 hover:text-accent transition-smooth"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base font-semibold shadow-sm hover:shadow-md"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Register link - Enhanced styling */}
        <p className="mt-7 text-sm text-muted-foreground/80 text-center">
          No Account?{" "}
          <Link
            to="/register"
            className="font-medium text-accent hover:text-accent-hover transition-smooth"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
