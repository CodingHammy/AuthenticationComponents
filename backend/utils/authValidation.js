function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!password || !strongPasswordRegex.test(password)) {
    return 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
}

function validateUsername(username) {
  if (!username || /\s/.test(username)) return 'Username is required';

  if (username.length > 8 || username.length < 3) {
    return 'Username must be between 3 and 8 characters long';
  }
  return null;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
};
