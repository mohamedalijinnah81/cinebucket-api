const express = require('express');
const router = express.Router();

// Test endpoint to verify authentication
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication successful',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;