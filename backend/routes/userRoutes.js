const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const registerRoute = require('../routes/auth/register.js');
const loginRoute = require('../routes/auth/login.js');
const resetpasswordRoute = require('../routes/auth/resetPassword.js');

const dashboardRoute = require('../user/dashboard.js');

dotenv.config();

// /api/users/register
router.use('/', registerRoute);

// /api/users/login
router.use('/', loginRoute);

// /api/users/resetpassword
router.use('/', resetpasswordRoute);

// /api/users/dashboard
router.use('/', dashboardRoute);

// HACK: logout is handled entirely in the frontend
// Placeholder route in case token blacklisting or session invalidation is added later.
router.use('/', require('../routes/auth/logout.js'));

module.exports = router;
