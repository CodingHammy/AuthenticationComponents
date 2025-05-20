import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/logout';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    // Call the handleLogout function to clear the token and redirect
    handleLogout(navigate);
  };

  return (
    <div className='max-w-md mx-auto p-4 gap-2 flex flex-col'>
      <h2 className='text-2xl '>DashboardPage</h2>
      <button
        onClick={handleLogoutClick}
        className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
      >
        Logout
      </button>
    </div>
  );
}
