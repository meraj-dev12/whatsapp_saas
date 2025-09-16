import React, { useState } from 'react';
import { PaperAirplaneIcon } from './icons';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Hardcoded credentials for demonstration
      if (username === 'admin' && password === 'password') {
        const fakeJwt = `header.${btoa(JSON.stringify({ user: 'admin', iat: Date.now() }))}.signature`;
        onLoginSuccess(fakeJwt);
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
             <PaperAirplaneIcon className="h-12 w-12 text-indigo-400 transform -rotate-45" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-400">WhatsApp Bulk Messenger</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username (admin)"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                // Fix: Corrected typo `_type` to `type` to ensure password input is masked.
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (password)"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
