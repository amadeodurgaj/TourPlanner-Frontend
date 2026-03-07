import UserService from "@/services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function RegistrationForm(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setpasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
      
      const LoginResponse = await UserService.login({
        username,
        password
      });
      
      // Store token in localStorage
     localStorage.setItem('token', LoginResponse.data!.token);
      
      // Redirect to dashboard
      navigate('/Profile');
    } catch (err) {
      setError('could not register');
    }
  };
    return (
    <>
      
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

        <div className="sm:mx-auto items-center justify-center font-mono text-3xl font-bold tracking-tight text-[var(--secondary)]">Tour Planner</div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-[var(--secondary)]-100">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="block w-full rounded-md bg-[var(--secondary)]/5 px-3 py-1.5 text-base text-[var(--secondary)] outline-1 -outline-offset-1 outline-[var(--secondary)]/10 placeholder:text-[var(--secondary)]-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--secondary)]-100">
                email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-[var(--secondary)]/5 px-3 py-1.5 text-base text-[var(--secondary)] outline-1 -outline-offset-1 outline-[var(--secondary)]/10 placeholder:text-[var(--secondary)]-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-[var(--secondary)]-100">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-[var(--secondary)]/5 px-3 py-1.5 text-base text-[var(--secondary)] outline-1 -outline-offset-1 outline-[var(--secondary)]/10 placeholder:text-[var(--secondary)]-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-[var(--secondary)]-100">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setpasswordConfirmation(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-[var(--secondary)]/5 px-3 py-1.5 text-base text-[var(--secondary)] outline-1 -outline-offset-1 outline-[var(--secondary)]/10 placeholder:text-[var(--secondary)]-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-[var(--secondary)] hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-[var(--secondary)]-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  )

}
