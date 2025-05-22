// middleware/auth.js
require('dotenv').config();

/**
 * Middleware to verify:
 * - RapidAPI Proxy Secret
 * - API Key: X-API-Key
 * - Bearer token: Authorization: Bearer your-token
 */
function authMiddleware(req, res, next) {
  const rapidApiSecret = req.headers['x-rapidapi-proxy-secret'];
  const apiKey = req.headers['x-api-key'];
  const bearerHeader = req.headers.authorization;

  // 1. Allow if request comes from RapidAPI
  if (rapidApiSecret === '6f835d00-34cf-11f0-a197-633c70986272') {
    return next();
  }

  // 2. Check for API Key
  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      return next(); // Valid API Key
    } else {
      return res.status(403).json({ error: 'Invalid API key' });
    }
  }

  // 3. Check for Bearer Token
  if (bearerHeader) {
    const parts = bearerHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(403).json({ error: 'Invalid token format' });
    }

    const token = parts[1];
    if (token === process.env.API_TOKEN) {
      return next(); // Valid Token
    } else {
      return res.status(403).json({ error: 'Invalid token' });
    }
  }

  // 4. If no auth method matched
  return res.status(401).json({ error: 'Authentication required' });
}

module.exports = authMiddleware;
