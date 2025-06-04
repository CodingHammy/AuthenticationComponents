// TODO: Implement startTokenExpiryTimer and stopTokenExpiryTimer
//       to manage token validation timer and call validateToken()    when timer expires.
// TODO: later update authform to intergrate the new timer logic

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  validateToken: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // NOTE: initially assume user is not authenticated
  const [isAuthenticated, setAuthenticated] = useState(false);
  // NOTE: Loading is set to true while token is being validated to prevent premature redirection in PrivateRoute
  const [isLoading, setLoading] = useState(true);
  // NOTE: token is stored in localstorage on intial render
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });

  const [logoutTimerId, setLogoutTimerId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const navigate = useNavigate();

  function getTokenExpiration(token: string): number {
    // NOTE: decode the token to get the expiration time
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  }

  const startTokenValidationCountdown = (token: string) => {
    // NOTE if there is exisiting timer, clear it
    if (logoutTimerId) {
      clearTimeout(logoutTimerId);
    }
    // NOTE: get the expiration time from the token
    const expirationTime = getTokenExpiration(token);
    const currentTime = Date.now();
    // NOTE: time left in millieseconds
    const miliSecondsUntilExpiration = expirationTime - currentTime;

    // NOTE: if time left wait until expiration or just validate immediately
    if (miliSecondsUntilExpiration > 0) {
      const timerID = setTimeout(() => {
        validateToken();
      }, miliSecondsUntilExpiration);
      setLogoutTimerId(timerID);
    } else {
      validateToken(); // Token already expired, validate immediately
    }
  };

  // NOTE: cancels countdown timer for token validation - when logging out
  const cancelValidationCountdown = () => {
    if (logoutTimerId) {
      clearTimeout(logoutTimerId);
      setLogoutTimerId(null);
    }
  };

  // NOTE: the login function sets the token and navigate to dashboard if successful
  // NOTE this function is called when the users clicks login button in AuthForm component
  const login = async (newToken: string, username: string) => {
    //NOTE: stores token to localstorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', username);
    //NOTE: updates token state state
    setToken(newToken);
    setUsername(username);

    // NOTE: Start countdown for token validation
    startTokenValidationCountdown(newToken);

    //TODO: check if i can avoid running validateToken here
    //      we know that the token is valid because the login creates a new token
    // await validateToken();
    setAuthenticated(true); //NOTE: sets authenticated to true
    //NOTE: navigates to dashboard
    navigate('/dashboard', { replace: true });
  };

  //  NOTE: the logout function removes the token from localstorage, and token state, sets authenticated to false and navigates to the login page
  // NOTE this function is called when the users clicks logout button in navbar component and is also in the dashboard page
  // TODO: implement a timer to automatically logout the user after a certain period of inactivity
  const logout = () => {
    //NOTE: removes token from localstorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    //NOTE: resets token state

    //NOTE cancels the countdown timer for token validation
    cancelValidationCountdown();

    setToken(null);
    setUsername(null);
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
      // HACK: aggressive error handling, could be improved
      // TODO: improve error handling - distinguish between 401(expired token) 500+(server error) and retry if appropriate
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
    validateToken(); //NOTE validate Token on initial load
  }, []);

  return (
    // NOTE: provides the auth context to the rest of the app
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        username,
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
