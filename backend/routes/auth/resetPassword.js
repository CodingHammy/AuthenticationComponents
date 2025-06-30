const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');

const {
  resetUsersPassword,
} = require('../../controllers/resetPasswordController');

router.post('/', authenticateToken, resetUsersPassword);

module.exports = router;
