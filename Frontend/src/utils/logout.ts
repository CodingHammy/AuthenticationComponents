export const handleLogout = (navigate: (path: string) => void) => {
  // Clear the token from local storage
  localStorage.removeItem('token');

  // Redirect to the login page
  navigate('/login');
};
