import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { logout, username } = useAuth();

  const handleLogoutClick = () => {
    // Call the handleLogout function to clear the token and redirect
    logout();
  };

  const UsernameCaptilised =
    username!.charAt(0).toUpperCase() + username!.slice(1);

  return (
    <div className='max-w-md mx-auto p-4 gap-2 flex flex-col text-center'>
      <h2 className='text-2xl '>DashboardPage</h2>
      <p>Welcome to your Dashboard {UsernameCaptilised}</p>
      <button
        onClick={handleLogoutClick}
        className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
      >
        Logout
      </button>
    </div>
  );
}
