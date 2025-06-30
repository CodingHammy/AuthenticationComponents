const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { validatePassword } = require('../utils/authValidation');

exports.resetUsersPassword = async (req, res) => {
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
};
