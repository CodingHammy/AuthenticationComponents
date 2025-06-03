const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/validation';

// NOTE: import authenticateToken middleware for protecting routes
const authenticateToken = require('../middlewares/authMiddleware');

dotenv.config();

router.post('/register', async (req, res) => {
  // NOTE: extracts email and makes it lowercase
  const email = req.body.email?.toLowerCase();
  const { password, username } = req.body;

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const usernameError = validateUsername(username);

  // if email, username or password isn't valid , return 400 error with errors
  if (emailError || passwordError || usernameError) {
    return res.status(400).json({
      errors: {
        email: emailError,
        password: passwordError,
        username: usernameError,
      },
    });
  }

  // NOTE: check if user already exists
  // const existingUser = users.find(user => user.email === email);
  const existingUser = User.findOne({ email });

  if (existingUser) {
    // HACK: this checks if user exists in memory array
    // TODO: implement db query to check user exists
    return res.status(400).json({ errors: { email: 'User already exists' } });
  }

  // NOTE: Hash password before storing user
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = User({ email, username, password: hashedPassword });
  await newUser.save();

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
  // NOTE: Extracts email, username and password  from request body

  // TODO: Add validation for email format, password strength.
  const email = req.body.email?.toLowerCase();
  const { password } = req.body;

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError || passwordError) {
    return res.status(400).json({
      errors: {
        email: emailError,
        password: passwordError,
      },
    });
  }

  // NOTE: Find user in in-memory array by email
  // HACK: using an in-memory array for users;
  // TODO: Replace this with a real database query
  const user = users.find(user => user.email === email);
  // NOTE: checks if user exists then compare input password with hashed password
  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));
  if (!user || !isPasswordCorrect) {
    return res
      .status(401)
      .json({ errors: { email: 'Invalid email or password' } });
  }

  // NOTE: Generate JWT token with user's email
  const token = jwt.sign(
    { email: user.email, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );

  // NOTE: Respond with token for client to store and use
  res.json({ token, user: { email: user.email, username: user.username } });
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
