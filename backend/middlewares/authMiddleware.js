const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // NOTE takes the second argument in auth header eg  "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ errors: { general: 'Access denied, No token provided' } });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ errors: { general: 'Invalid token or expired token.' } });
    }
    // NOTE: user contains the decoded JWT payload (e.g., email, iat, exp)
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
