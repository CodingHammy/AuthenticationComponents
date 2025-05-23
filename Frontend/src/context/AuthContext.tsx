import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  validateToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const navigate = useNavigate();

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/', { replace: true });
  };

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/users/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error validating token:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
