const express = require('express');
const moviesRoutes = require('./routes/movies');
const filtersRoutes = require('./routes/filters');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/api/movies', moviesRoutes);
app.use('/api/filters', filtersRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;