const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerRoute = require('../auth/register.js');
const loginRoute = require('../auth/login.js');

const { validatePassword } = require('../utils/authValidation');

// NOTE: import authenticateToken middleware for protecting routes
const authenticateToken = require('../middlewares/authMiddleware');

dotenv.config();

router.use('/', registerRoute);
router.use('/', loginRoute);

// router.post('/register', async (req, res) => {
//   // NOTE: extracts email and makes it lowercase
//   const email = req.body.email?.toLowerCase();
//   const { password, username } = req.body;

//   const emailError = validateEmail(email);
//   const passwordError = validatePassword(password);
//   const usernameError = validateUsername(username);

//   // if email, username or password isn't valid , return 400 error with errors
//   if (emailError || passwordError || usernameError) {
//     return res.status(400).json({
//       errors: {
//         email: emailError,
//         password: passwordError,
//         username: usernameError,
//       },
//     });
//   }

//   // NOTE: check if user already exists
//   // const existingUser = users.find(user => user.email === email);
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return res.status(400).json({ errors: { email: 'User already exists' } });
//   }

//   // NOTE: Hash password before storing user
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newUser = User({ email, username, password: hashedPassword });
//   await newUser.save();

//   // NOTE: Generate JWT token for the new user
//   const token = jwt.sign(
//     { email: newUser.email, username: newUser.username },
//     process.env.JWT_SECRET,
//     {
//       // TODO: Set time to 1hr after testing
//       expiresIn: '1hr',
//     },
//   );

//   res.status(201).json({
//     message: 'User registered successfully',
//     token,
//     user: { email: newUser.email, username: newUser.username },
//   });
// });

// router.post('/login', async (req, res) => {
//   // NOTE: Extracts email, username and password  from request body

//   const email = req.body.email?.toLowerCase();
//   const { password } = req.body;

//   const emailError = validateEmail(email);
//   const passwordError = validatePassword(password);

//   if (emailError || passwordError) {
//     return res.status(400).json({
//       errors: {
//         email: emailError,
//         password: passwordError,
//       },
//     });
//   }

//   // NOTE: Find user in in db

//   const user = await User.findOne({ email }).select('+password');
//   // NOTE: checks if user exists then compare input password with hashed password
//   const isPasswordCorrect =
//     user && (await bcrypt.compare(password, user.password));
//   if (!user || !isPasswordCorrect) {
//     return res
//       .status(401)
//       .json({ errors: { email: 'Invalid email or password' } });
//   }

//   // NOTE: Generate JWT token with user's email
//   const token = jwt.sign(
//     { email: user.email, username: user.username },
//     process.env.JWT_SECRET,
//     {
//       // TODO: Set time to 1hr after testing
//       expiresIn: '1hr',
//     },
//   );

//   // NOTE: Respond with token for client to store and use
//   res.json({ token, user: { email: user.email, username: user.username } });
// });

router.post('/resetpassword', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  const email = req.user?.email?.toLowerCase();

  const passwordError = validatePassword(newPassword);

  if (passwordError) {
    return res.status(400).json({
      errors: {
        password: passwordError,
      },
    });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ errors: { email: 'User not found' } });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ errors: { general: 'Internal server error' } });
  }
});

// NOTE: This route simulates a logout operation
// INFO: Token blacklist is not implemented. For higher security, consider it in future.
router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'Logged out successfully, please remove token from the client',
  });
});

// NOTE: Protected route - only accessible with a valid jwt
// NOTE: Token is verified using authenticateToken middleware
router.get('/dashboard', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the dashboard! ',
    // NOTE: This contains user data from the verified JWT
    user: req.user,
  });
});

module.exports = router;
