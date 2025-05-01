const express = require('express');
const moviesRoutes = require('./routes/movies');
const filtersRoutes = require('./routes/filters');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/movies', moviesRoutes);
app.use('/api/filters', filtersRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
