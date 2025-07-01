import { Link } from 'react-router-dom';

type UserDropdownProps = {
  path: string;
  logout: () => void;
};

export default function UserDropdown({ path, logout }: UserDropdownProps) {
  const isDashboard = path === '/dashboard';
  const isResetPassword = path === '/reset-password';
  return (
    <ul
      className='absolute right-[-17px] mt-1 w-36 bg-gray-800 text-white rounded-bl-2xl shadow-lg py-3 pr-2 text-end'
      role='menu'
      id='user-menu'
    >
      {isDashboard && (
        <li className='mt-2 pr-[8px]'>
          <Link
            className='hover:underline'
            to='/reset-password'
            data-testid='link-reset-password'
            aria-label='Navigate to reset password'
          >
            Reset Password
          </Link>
        </li>
      )}
      {isResetPassword && (
        <li className='mt-2 pr-[8px]'>
          <Link
            className='hover:underline'
            to='/dashboard'
            data-testid='link-dashboard'
            aria-label='Navigate to the dashboard'
          >
            Dashboard
          </Link>
        </li>
      )}
      <li className='mt-2 pr-[8px]'>
        <button
          onClick={() => logout()}
          className='hover:underline'
          data-testid='logout-button'
          aria-label='Logout user button'
        >
          Logout
        </button>
      </li>
    </ul>
  );
}
