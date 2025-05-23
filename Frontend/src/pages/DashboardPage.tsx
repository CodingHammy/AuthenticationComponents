import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();

  const handleLogoutClick = () => {
    // Call the handleLogout function to clear the token and redirect
    logout();
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
