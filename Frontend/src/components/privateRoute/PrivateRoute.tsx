import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import AccessDenied from './AccessDenied';

type Props = {
  children: React.JSX.Element;
};

// NOTE: Protects routes from unauthenticated access
const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading, validateToken } = useAuth();

  const navigate = useNavigate();
  // NOTE: makes sure backend sercures private routes
  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('Checking token validity...');
        await validateToken();
      } catch (error) {
        console.log('Token validation failed', error);
      }
    };
    checkToken();
  }, [validateToken]);

  // NOTES: Wait for auth status to be determined before rendering Children
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // NOTES: redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return <AccessDenied onLoginRedirect={() => navigate('/')} />;
  }
  // NOTES: render protected content if user is authenticated
  return children;
};

export default PrivateRoute;
