import { useState, useEffect } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {isLoginMode ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsLoginMode(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsLoginMode(true)}
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}