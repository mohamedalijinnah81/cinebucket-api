const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/movie/:id
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    // Get movie details
    const [movies] = await db.query('SELECT * FROM movies WHERE id = ?', [movieId]);
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const movie = movies[0];

    // Get download links
    const [downloadLinks] = await db.query('SELECT label, url FROM download_links WHERE movie_id = ?', [movieId]);

    // Get genres
    const [genres] = await db.query(`
      SELECT g.name FROM genres g
      JOIN movie_genres mg ON g.id = mg.genre_id
      WHERE mg.movie_id = ?
    `, [movieId]);

    // Get tags
    const [tags] = await db.query(`
      SELECT t.name FROM tags t
      JOIN movie_tags mt ON t.id = mt.tag_id
      WHERE mt.movie_id = ?
    `, [movieId]);

    res.json({
      ...movie,
      download_links: downloadLinks,
      genres: genres.map(g => g.name),
      tags: tags.map(t => t.name),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
