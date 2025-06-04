import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

type Props = {
  children: React.JSX.Element;
};

// NOTE: Protects routes from unauthenticated access
const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading, validateToken } = useAuth();

  // NOTE: makes sure backend sercures private routes
  useEffect(() => {
    const checkToken = async () => {
      await validateToken();
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTES: Wait for auth status to be determined before rendering Children
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // NOTES: redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  // NOTES: render protected content if user is authenticated
  return children;
};

export default PrivateRoute;
