const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token from header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      req.employee = await Employee.findById(decoded.id).select('-password'); // Attach user to request
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };