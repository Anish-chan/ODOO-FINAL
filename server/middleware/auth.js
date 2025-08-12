const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.user.id;
    req.userRole = decoded.user.role;
    req.userEmail = decoded.user.email;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has specific role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Special middleware for demo owner to access admin endpoints
const checkRoleOrDemoOwner = (roles) => {
  return (req, res, next) => {
    // Allow demo owner to access admin endpoints
    if (req.userEmail === 'owner1@demo.com') {
      return next();
    }
    
    // Otherwise, check normal role permissions
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { auth, checkRole, checkRoleOrDemoOwner };
