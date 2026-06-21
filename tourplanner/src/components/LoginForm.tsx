import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

        {/* Form Card */}
        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground/80 hover:text-accent transition-smooth"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>
        </Card>

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
