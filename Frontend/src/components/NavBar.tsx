import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
    <nav className='relative flex justify-between items-center p-4 bg-gray-800 text-white'>
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
          <div>
            <button
              className='flex items-center gap-2 hover:underline'
              ref={buttonRef}
              onClick={() => setBtnActive(!btnActive)}
            >
              <span className='font-semibold flex gap-2'>
                {capitalisedUsername}
                <img
                  src='../../public/downIcon.svg'
                  alt='down button'
                  className={`${btnActive && 'rotate-180'} ${
                    btnActive && 'mt-[5px]'
                  }`}
                />
              </span>
            </button>
            {btnActive && (
              <div className='relative' ref={menuRef}>
                <ul className='absolute right-[-17px] mt-1 w-36 bg-gray-800 text-white rounded-bl-2xl shadow-lg py-3 pr-2 text-end'>
                  {path === '/dashboard' && (
                    <li className='mt-2 pr-[8px]'>
                      <Link className='hover:underline' to='/reset-password'>
                        Reset Password
                      </Link>
                    </li>
                  )}
                  {path === '/reset-password' && (
                    <li className='mt-2 pr-[8px]'>
                      <Link className='hover:underline' to='/dashboard'>
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li className='mt-2 pr-[8px]'>
                    <button
                      onClick={() => logout()}
                      className='hover:underline'
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
