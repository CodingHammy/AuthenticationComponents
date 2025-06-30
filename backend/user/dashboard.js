const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// NOTE: Protected route - only accessible with a valid jwt
// NOTE: Token is verified using authenticateToken middleware
router.get('/', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the dashboard! ',
    // NOTE: This contains user data from the verified JWT
    user: req.user,
  });
});

module.exports = router;
