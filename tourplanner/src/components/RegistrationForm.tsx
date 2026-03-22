import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


export default function RegistrationForm(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setpasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await UserService.register({
        username,
        email,
        password,
        passwordConfirmation
      });

      const LoginResponse = await AuthService.login({
        username,
        password
      });

      login();
      navigate('/Profile');
    } catch (err) {
      setError('could not register');
    }
  };
    return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="font-serif text-display font-bold tracking-tight text-secondary text-center">
          Create Account
        </h2>
        <p className="mt-3 font-serif text-lg font-light text-muted text-center tracking-wide">
          Begin your adventure today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label 
              htmlFor="username" 
              className={`block font-serif text-sm font-medium tracking-wide transition-colors duration-200 ${
                isFocused === 'username' ? 'text-accent' : 'text-secondary'
              }`}
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused('username')}
                onBlur={() => setIsFocused(null)}
                required
                autoComplete="username"
                className="block w-full font-serif bg-secondary/5 border-b-2 border-border px-4 py-3 text-base text-secondary tracking-wide outline-none transition-all duration-200 placeholder:text-muted-light focus:border-accent focus:bg-accent/5"
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="email" 
              className={`block font-serif text-sm font-medium tracking-wide transition-colors duration-200 ${
                isFocused === 'email' ? 'text-accent' : 'text-secondary'
              }`}
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                required
                autoComplete="email"
                className="block w-full font-serif bg-secondary/5 border-b-2 border-border px-4 py-3 text-base text-secondary tracking-wide outline-none transition-all duration-200 placeholder:text-muted-light focus:border-accent focus:bg-accent/5"
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className={`block font-serif text-sm font-medium tracking-wide transition-colors duration-200 ${
                isFocused === 'password' ? 'text-accent' : 'text-secondary'
              }`}
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused(null)}
                required
                autoComplete="new-password"
                className="block w-full font-serif bg-secondary/5 border-b-2 border-border px-4 py-3 text-base text-secondary tracking-wide outline-none transition-all duration-200 placeholder:text-muted-light focus:border-accent focus:bg-accent/5"
              />
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="passwordConfirmation" 
              className={`block font-serif text-sm font-medium tracking-wide transition-colors duration-200 ${
                isFocused === 'passwordConfirmation' ? 'text-accent' : 'text-secondary'
              }`}
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setpasswordConfirmation(e.target.value)}
                onFocus={() => setIsFocused('passwordConfirmation')}
                onBlur={() => setIsFocused(null)}
                required
                autoComplete="new-password"
                className="block w-full font-serif bg-secondary/5 border-b-2 border-border px-4 py-3 text-base text-secondary tracking-wide outline-none transition-all duration-200 placeholder:text-muted-light focus:border-accent focus:bg-accent/5"
              />
            </div>
          </div>

          {error && (
            <div className="text-danger font-serif text-sm text-center tracking-wide py-2">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              className="group relative w-full font-serif text-lg font-medium tracking-wide text-primary bg-secondary overflow-hidden transition-all duration-300 hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
            >
              <span className="relative z-10 block py-3">Create Account</span>
              <span className="absolute inset-0 bg-accent-hover transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>
          </div>
        </form>

        <p className="mt-10 font-serif text-base text-muted text-center tracking-wide">
          Already have an account?{' '}
          <a href="/login" className="text-secondary underline decoration-accent underline-offset-4 hover:text-accent transition-colors duration-200">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )

}
