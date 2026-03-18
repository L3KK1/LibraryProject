const express = require('express');
const router = express.Router();
const { query } = require('../db'); 

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        genre_id,
        genre_name         
      FROM Genres
      ORDER BY genre_name ASC
    `);

    res.json({
      success: true,
      data: result.recordset
    });
  } catch (err) {
    console.error('Ошибка получения жанров:', err);
    res.status(500).json({
      success: false,
      message: 'Не удалось загрузить жанры',
      error: err.message
    });
  }
});

module.exports = router;