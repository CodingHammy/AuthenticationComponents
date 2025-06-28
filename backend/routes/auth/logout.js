const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'Logged out successfully, please remove token from the client',
  });
});

module.exports = router;
