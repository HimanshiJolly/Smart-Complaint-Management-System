const jwt = require('jsonwebtoken');

// =====================================
// PROTECT MIDDLEWARE
// =====================================
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token, authorization denied'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // MUST contain id + role

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token is not valid'
    });
  }
};

// =====================================
// ADMIN + SUPERADMIN ACCESS
// =====================================
const adminOnly = (req, res, next) => {
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'superadmin'
  ) {
    return res.status(403).json({
      message: 'Access denied: Admins only'
    });
  }

  next();
};

// =====================================
// EXPORT
// =====================================
module.exports = {
  protect,
  adminOnly
};