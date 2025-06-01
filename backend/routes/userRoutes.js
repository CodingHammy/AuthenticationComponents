const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// NOTE: import authenticateToken middleware for protecting routes
const authenticateToken = require('../middlewares/authMiddleware');

dotenv.config();
// Hack: using in-memory storage for users; not suitable for production
// TODO: Replace this with a real database for persistent storage
const users = [];

router.post('/register', async (req, res) => {
  // HACK: missing validation for email format, password strength.
  const { email, password, username } = req.body;

  // if no email or password is provided, return 400 error
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: 'Email, username and password are required' });
  }

  // NOTE: check if user already exists (in memory array)
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    // HACK: this checks if user exists in memory array
    // TODO: implement db query to check user exists
    return res.status(400).json({ message: 'User already exists' });
  }

  // NOTE: Hash password before storing user
  // HACK: Saving user in memory array; replace with DB save
  // TODO: Implement DB persistence for new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, username, password: hashedPassword };
  users.push(newUser);

  // NOTE: Generate JWT token for the new user
  const token = jwt.sign(
    { email: newUser.email, username: newUser.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { email: newUser.email, username: newUser.username },
  });
});

router.post('/login', async (req, res) => {
  // NOTE: Extracts email and password from request body
  // HACK: missing validation for email format, password strength and username not yet supported username.
  // TODO: Add validation for email format, password strength and username.
  const { email, password } = req.body;

  // NOTE: Find user in in-memory array by email
  // HACK: using an in-memory array for users;
  // TODO: Replace this with a real database query
  const user = users.find(users => users.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // NOTE: compare input password with hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // NOTE: Generate JWT token with user's email
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // NOTE: Respond with token for client to store and use
  res.json({ token });
});

// NOTE: This route simulates a logout operation
// HACK: No real session/token invalidation occurs on the server
// TODO: Implement token blacklist or proper session handling if needed
router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'Logged out successfully, please remove token from the client',
  });
});

// NOTE: Protected route - only accessible with a valid jwt
// NOTE: Token is verified using authenticateToken middleware
// TODO: Customize dashboard data based on authenticated user
router.get('/dashboard', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the dashboard! ',
    // NOTE: This contains user data from the verified JWT
    user: req.user,
  });
});

module.exports = router;
