const express = require('express');
const moviesRoutes = require('./routes/movies');
const filtersRoutes = require('./routes/filters');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Public endpoint (no authentication required)
app.get('/', (req, res) => {
  res.json({ 
    status: 'CineBucket API is running',
    message: 'Authentication required for API endpoints' 
  });
});

// Protected routes with authentication middleware
app.use('/api/movies', authMiddleware, moviesRoutes);
app.use('/api/filters', authMiddleware, filtersRoutes);
app.use('/api/auth', authMiddleware, authRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;