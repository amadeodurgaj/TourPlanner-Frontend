import { toast } from 'sonner';
import UserService from "@/services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await UserService.register({
        username,
        email,
        password,
        passwordConfirmation,
      });

      const success = await login(username, password);
      if (success) {
        toast.success('Account created successfully!');
        navigate("/dashboard");
      } else {
        setError("Could not register");
      }
    } catch (err) {
      toast.error('Registration failed. Please check your information.');
      setError("Could not register");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header - Enhanced */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Create Account
          </h1>
          <p className="mt-3 text-base text-muted-foreground/80">
            Begin your adventure today
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
              placeholder="Choose a username"
            />

            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Create a password"
            />

            <Input
              id="passwordConfirmation"
              label="Confirm Password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Confirm your password"
            />

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>
        </Card>

        {/* Login link - Enhanced */}
        <p className="mt-7 text-sm text-muted-foreground/80 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-accent hover:text-accent-hover transition-smooth"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
