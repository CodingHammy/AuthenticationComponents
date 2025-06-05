import { useNavigate, useLocation } from 'react-router-dom';

export default function SessionExpiredPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const handleClick = () => {
    // Navigate to the login page
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-2'>Session Expired</h1>
      <p>{message} Please log in again.</p>
      <button
        className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-3'
        onClick={handleClick}
      >
        To Login
      </button>
    </div>
  );
}
