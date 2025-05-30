import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.JSX.Element;
};

// NOTE: Protects routes from unauthenticated access
const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();

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
