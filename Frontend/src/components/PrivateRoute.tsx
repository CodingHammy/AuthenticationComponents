import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

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
      console.log('Checking token validity...');
      await validateToken();
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTES: Wait for auth status to be determined before rendering Children
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleClick = () => {
    return navigate('/');
  };
  // NOTES: redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center h-screen max-w-md mx-auto '>
        <h1 className='text-2xl font-bold mb-2'>Access Denied</h1>
        <p className='text-center flex flex-wrap mb-2 px-4'>
          You are not authenticated, please log in to access this page.
        </p>
        <button
          onClick={handleClick}
          className='p-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Go to Login
        </button>
      </div>
    );
  }
  // NOTES: render protected content if user is authenticated
  return children;
};

export default PrivateRoute;
