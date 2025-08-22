const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if this is a demo token
      if (decoded.id === 'demo-user-123') {
        // Demo token - create a mock user object
        req.user = {
          _id: 'demo-user-123',
          email: 'demo@clicko.com',
          firstName: 'Demo',
          lastName: 'User',
          company: 'Clicko Digital',
          role: 'user',
          isActive: true
        };
        console.log('🔐 Demo token authenticated successfully');
        return next();
      }

      // Regular user token - get user from database
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ error: 'User account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
