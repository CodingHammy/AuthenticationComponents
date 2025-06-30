const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const registerRoute = require('../routes/auth/register');
const loginRoute = require('../routes/auth/login');
const resetpasswordRoute = require('../routes/auth/resetPassword');

const dashboardRoute = require('../user/dashboard');

dotenv.config();

// /api/users/register
router.use('/register', registerRoute);

// /api/users/login
router.use('/login', loginRoute);

// /api/users/resetpassword
router.use('/resetpassword', resetpasswordRoute);

// /api/users/dashboard
router.use('/dashboard', dashboardRoute);

module.exports = router;
