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
  // NOTE this function is called when the users clicks login button in AuthForm component
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

  //  NOTE: the logout function removes the token from localstorage, and token state, sets authenticed to false and navigates to the login page
  // NOTE this function is called when the users clicks logout button in navbar component and is also in the dashboard page
  // TODO: implement a timer to automatically logout the user after a certain period of inactivity
  const logout = () => {
    //NOTE: removes token from localstorage
    localStorage.removeItem('token');
    //NOTE: resets token state
    setToken(null);
    //NOTE: marks user as not authenticated
    setAuthenticated(false);
    //NOTE: navigates to login page
    navigate('/', { replace: true });
  };

  // NOTE: the validateToken function checks if the token is valid by making a request to the dashboard endpoint, if valid it sets authenticated to true, which is used to determine whether the user can access protected routes, if not valid it calls the logout function
  // NOTE this function is called when the app loads and also when the user logs in
  // TODO: implement a timer-based auto-logout for session expiration or inactivity
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    //NOTE: if no token is found, user is not authenticated stops loading to unblock navigate
    if (!token) {
      // NOTE: sets authenticated to false to block access to protected routes
      setAuthenticated(false);
      // NOTE: sets loading to false to unblock navigation
      setLoading(false);
      return;
    }

    // NOTES: makes request to protected /dashboard route with token
    try {
      const res = await fetch('http://localhost:3000/api/users/dashboard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // NOTE: token is valid if the response is ok
      if (res.ok) {
        setAuthenticated(true);
      } else {
        // NOTE: token is invalid or expired, calls logout
        logout();
      }
      // HACK: aggresive error handling, could be improved
      // TODO: improve error handling - distiguish between 401(expired token) 500+(server error) and retry if appropriate
    } catch (error) {
      console.error('Error validating token:', error);
      logout();
    } finally {
      // NOTE: done loading - used by privateroute to wait for validation to complete
      setLoading(false);
    }
  };

  // NOTE: isloading prevents premature redirection in privateroute by waiting for validation to complete
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
