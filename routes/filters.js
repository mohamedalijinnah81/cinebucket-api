const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/filters
router.post('/', async (req, res) => {
  const { genre, tag, year, start = 0, limit = 10 } = req.body;

  try {
    let query = `
      SELECT DISTINCT m.* FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON g.id = mg.genre_id
      LEFT JOIN movie_tags mt ON m.id = mt.movie_id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE 1 = 1
    `;
    const values = [];

    if (genre) {
      query += ' AND g.name = ?';
      values.push(genre);
    }
    if (tag) {
      query += ' AND t.name = ?';
      values.push(tag);
    }
    if (year) {
      query += ' AND m.year = ?';
      values.push(year);
    }

    query += ' ORDER BY m.id DESC LIMIT ?, ?';
    values.push(Number(start), Number(limit));

    const [results] = await db.query(query, values);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
