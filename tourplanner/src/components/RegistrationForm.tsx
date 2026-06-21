import { toast } from 'sonner';
import UserService from "@/services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

        {/* Form Card - Enhanced */}
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
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="field-control placeholder-muted-foreground/50"
                placeholder="Enter your email"
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
                autoComplete="new-password"
                className="field-control placeholder-muted-foreground/50"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirmation"
                className="block text-sm font-medium text-foreground mb-2.5"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                autoComplete="new-password"
                className="field-control placeholder-muted-foreground/50"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base font-semibold shadow-sm hover:shadow-md"
            >
              Create Account
            </button>
          </form>
        </div>

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
