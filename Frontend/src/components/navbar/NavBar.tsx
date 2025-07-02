import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

export default function NavBar() {
  const { isAuthenticated, logout, username } = useAuth();
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);
  const [btnActive, setBtnActive] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPath(location.pathname);
    setBtnActive(false); // Reset button state when path changes
  }, [path, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // NOTE ref is the button that toggles the menu
      // NOTE
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setBtnActive(false); // Close the menu if clicked outside
      }
    };

    if (btnActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [btnActive]);

  const capitalisedUsername =
    isAuthenticated && username
      ? username.charAt(0).toUpperCase() + username.slice(1)
      : '';

  return (
    <nav
      aria-label='main navigation'
      className='relative flex justify-between items-center p-4 bg-gray-800 text-white'
    >
      <h2 className='font-bold'>Auth-4</h2>
      <div className='space-x-4'>
        {!isAuthenticated ? (
          <>
            <Link
              className='hover:underline'
              to='/'
              data-testid='link-login'
              aria-label='Link to log in page'
            >
              Login
            </Link>
            <Link
              className='hover:underline'
              to='/register'
              data-testid='link-register'
              aria-label='Link to registration page'
            >
              Register
            </Link>
          </>
        ) : (
          <div>
            <button
              className='flex items-center gap-2 hover:underline'
              ref={buttonRef}
              data-testid='user-dropdown-btn'
              aria-label='Toggle user menu'
              aria-expanded={btnActive}
              aria-controls='user-menu'
              onClick={() => setBtnActive(!btnActive)}
            >
              <span className='font-semibold flex gap-2'>
                {capitalisedUsername}
                <img
                  src='/downIcon.svg'
                  alt='toggle dropdown'
                  className={`${btnActive && 'rotate-180'} ${
                    btnActive && 'mt-[5px]'
                  }`}
                />
              </span>
            </button>
            {btnActive && (
              <div className='relative' ref={menuRef}>
                <UserDropdown path={path} logout={logout} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
