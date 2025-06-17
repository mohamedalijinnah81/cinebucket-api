const express = require('express');
const router = express.Router();
const db = require('../db');

//POST /api/movies with pagination and search
router.post("/", async (req, res) => {
  const { start = 0, limit = 10, search_query = '' } = req.body;

  try {
    let baseQuery = `
      SELECT m.*
      FROM movies m
      INNER JOIN (
        SELECT MAX(id) AS max_id, name
        FROM movies
        GROUP BY name
      ) AS max_vals ON m.id = max_vals.max_id
      WHERE 1=1
    `;
    const values = [];

    if (search_query.trim() !== '') {
      baseQuery += " AND m.name LIKE ?";
      values.push(`%${search_query}%`);
    }

    baseQuery += " ORDER BY m.id DESC LIMIT ?, ?";
    values.push(Number(start), Number(limit));

    const [movies] = await db.query(baseQuery, values);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET movie by ID (with links, genres, tags)
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const [[movie]] = await db.query('SELECT * FROM movies WHERE id = ?', [movieId]);

    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const [download_links] = await db.query('SELECT label, url FROM download_links WHERE movie_id = ?', [movieId]);

    const [genres] = await db.query(
      `SELECT g.name FROM genres g 
       JOIN movie_genres mg ON g.id = mg.genre_id 
       WHERE mg.movie_id = ?`,
      [movieId]
    );

    const [tags] = await db.query(
      `SELECT t.name FROM tags t 
       JOIN movie_tags mt ON t.id = mt.tag_id 
       WHERE mt.movie_id = ?`,
      [movieId]
    );

    res.json({ 
      ...movie, 
      download_links, 
      genres: genres.map((g) => g.name), 
      tags: tags.map((t) => t.name) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export router
module.exports = router;