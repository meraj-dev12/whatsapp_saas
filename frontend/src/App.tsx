import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [authToken, setAuthToken] = useLocalStorage<string | null>('admin-auth-token', null);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {authToken ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
