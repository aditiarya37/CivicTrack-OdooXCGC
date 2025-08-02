const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = { id: decoded.userId, role: 'user' }; // Mock user for now
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};
