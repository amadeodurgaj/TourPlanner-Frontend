import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await UserService.login({
        username,
        password
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data!.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-[var(--secondary)]-100">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a>
                </div>
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
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-[var(--secondary)]-400">
            No Account?{' '}
            <a href="/Register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
