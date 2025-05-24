import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      <h2 className='font-bold'>Auth-4</h2>
      <div className='space-x-4'>
        {!isAuthenticated ? (
          <>
            <Link className='hover:underline' to='/'>
              Login
            </Link>
            <Link className='hover:underline' to='/register'>
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className='hover:underline'>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
