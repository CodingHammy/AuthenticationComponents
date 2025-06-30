const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');

const {
  resetUsersPassword,
} = require('../../controllers/resetPasswordController');

router.post('/resetpassword', authenticateToken, resetUsersPassword);

module.exports = router;
