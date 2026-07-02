const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Wraps async route handlers so thrown/rejected errors reach errorHandler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists' });
  }

  req.user = user;
  next();
});

module.exports = { protect, asyncHandler };
