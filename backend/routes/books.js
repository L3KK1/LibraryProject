const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET /api/books 
router.get('/', async (req, res) => {
  const { 
    search = '', 
    genre = '', 
    limit = 500, 
    offset = 0 
  } = req.query;

  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  try {
    // Основной запрос
    let sql = `
      SELECT 
        book_id, title, publication_year, publisher, 
        genre_id, page_count, description
      FROM Books
      WHERE 1=1
    `;

    const params = {};

    // Поиск
    if (search.trim()) {
      sql += ` AND title LIKE @search`;
      params.search = `%${search.trim()}%`;
    }

    // Фильтр
    if (genre && genre !== '') {
      sql += ` AND genre_id = @genre`;
      params.genre = parseInt(genre);
    }

    sql += `
      ORDER BY title ASC
      OFFSET @offset ROWS 
      FETCH NEXT @limit ROWS ONLY
    `;

    params.offset = offsetNum;
    params.limit = limitNum;

    const result = await query(sql, params);

    // Всего книг
    let countSql = `
      SELECT COUNT(*) as total 
      FROM Books 
      WHERE 1=1
    `;

    const countParams = {};



    const countResult = await query(countSql, countParams);

    res.json({
      success: true,
      data: result.recordset,
      pagination: {
        total: countResult.recordset[0].total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: result.recordset.length === limitNum
      }
    });

  } catch (err) {
    console.error('Ошибка при получении книг:', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при загрузке книг'
    });
  }
});

module.exports = router;