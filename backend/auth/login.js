const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { validateEmail, validatePassword } = require('../utils/authValidation');

router.post('/login', async (req, res) => {
  // NOTE: Extracts email, username and password  from request body

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

  // NOTE: Find user in in db

  const user = await User.findOne({ email }).select('+password');
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
      // TODO: Set time to 1hr after testing
      expiresIn: '1hr',
    },
  );

  // NOTE: Respond with token for client to store and use
  res.json({ token, user: { email: user.email, username: user.username } });
});

module.exports = router;
