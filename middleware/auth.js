// middleware/auth.js
require('dotenv').config();

/**
 * Middleware to verify API key or Bearer token
 * Supports both:
 * - API Key in header: X-API-Key: your-api-key
 * - Bearer token: Authorization: Bearer your-token
 */
function authMiddleware(req, res, next) {
  // Get token from header
  const bearerHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  
  // Check for API Key first
  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      next(); // API Key is valid
    } else {
      return res.status(403).json({ error: 'Invalid API key' });
    }
  } 
  // Then check for Bearer token
  else if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
      return res.status(403).json({ error: 'Invalid token format' });
    }
    
    const token = bearer[1];
    
    // Verify the token
    if (token === process.env.API_TOKEN) {
      next(); // Token is valid
    } else {
      return res.status(403).json({ error: 'Invalid token' });
    }
  } else {
    // No authentication provided
    return res.status(401).json({ error: 'Authentication required' });
  }
}

module.exports = authMiddleware;