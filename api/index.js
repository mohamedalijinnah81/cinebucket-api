const serverless = require('vercel-serverless-express');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Import routes
const moviesRouter = require('../routes/movies');
const movieRouter = require('../routes/movie');
const filtersRouter = require('../routes/filters');

// Use routes
app.use('/api/movies', moviesRouter);
app.use('/api/movie', movieRouter);
app.use('/api/filters', filtersRouter);

// Export handler
module.exports = serverless(app);
