const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to the dashboard! ', user: req.user });
});

module.exports = router;
