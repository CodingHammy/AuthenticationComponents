// TODO: Implement startTokenExpiryTimer and stopTokenExpiryTimer
//       to manage token validation timer and call validateToken()    when timer expires.
// TODO: later update authform to intergrate the new timer logic

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  validateToken: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const navigate = useNavigate();

  // NOTE: the login function sets the token and naivigate to dashboard if successful

  const login = async (newToken: string) => {
    //NOTE: stores token to localstorage
    localStorage.setItem('token', newToken);
    //NOTE: updates token state state
    setToken(newToken);
    //TODO: check if i can avoid running validateToken here
    //      we know that the token is valid because the login creates a new token
    await validateToken();
    //NOTE: navigates to dashboard
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthenticated(false);
    navigate('/', { replace: true });
  };

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/users/dashboard', {
        method: 'GET',
        headers: {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken(); // run once on load
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        validateToken,
      }}
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
