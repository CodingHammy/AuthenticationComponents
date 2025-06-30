const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  validateEmail,
  validatePassword,
  validateUsername,
} = require('../utils/authValidation');

exports.registerUser = async (req, res) => {
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
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ errors: { email: 'User already exists' } });
  }

  // NOTE: Hash password before storing user
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, username, password: hashedPassword });
  await newUser.save();

  // NOTE: Generate JWT token for the new user
  const token = jwt.sign(
    { email: newUser.email, username: newUser.username },
    process.env.JWT_SECRET,
    {
      // TODO: Set time to 1hr after testing
      expiresIn: '1hr',
    },
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { email: newUser.email, username: newUser.username },
  });
};
