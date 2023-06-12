const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers or cookies
  const token = req.headers.authorization || req.cookies.token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Set the user object in the request
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  });
};

module.exports = authMiddleware;
