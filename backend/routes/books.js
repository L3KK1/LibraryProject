const express = require('express');
const router = express.Router();
const { query } = require('../db');  

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        book_id, title, publication_year, publisher, 
        genre_id, page_count, description
      FROM Books
      ORDER BY title ASC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET one book
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM Books WHERE book_id = @id
    `, { id: req.params.id });
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Книга не найдена' });
    }
    
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Создать книгу
router.post('/', async (req, res) => {
  const { title, publication_year, publisher, genre_id, page_count, description } = req.body;
  
  if (!title || !publication_year || !genre_id) {
    return res.status(400).json({ success: false, message: 'Обязательные поля: title, publication_year, genre_id' });
  }

  try {
    await query(`
      INSERT INTO Books 
        (title, publication_year, publisher, genre_id, page_count, description)
      VALUES 
        (@title, @publication_year, @publisher, @genre_id, @page_count, @description)
    `, {
      title, 
      publication_year: publication_year || null,
      publisher: publisher || null,
      genre_id,
      page_count: page_count || null,
      description: description || null
    });

    res.status(201).json({ success: true, message: 'Книга добавлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Обновить книгу
router.put('/:id', async (req, res) => {
  const { title, publication_year, publisher, genre_id, page_count, description } = req.body;
  const id = req.params.id;

  try {
    const result = await query(`
      UPDATE Books
      SET 
        title = @title,
        publication_year = @publication_year,
        publisher = @publisher,
        genre_id = @genre_id,
        page_count = @page_count,
        description = @description
      WHERE book_id = @id
    `, {
      id,
      title,
      publication_year: publication_year || null,
      publisher: publisher || null,
      genre_id,
      page_count: page_count || null,
      description: description || null
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Книга не найдена' });
    }

    res.json({ success: true, message: 'Книга обновлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
   
    const check = await query(`
      SELECT COUNT(*) as active
      FROM Loans
      WHERE book_id = @bookId
        AND return_date IS NULL
    `, { bookId });

    const activeLoans = check.recordset[0].active;

    if (activeLoans > 0) {
      return res.status(400).json({
        success: false,
        message: `Нельзя удалить книгу — она выдана ${activeLoans} читателям и ещё не возвращена`
      });
    }

  
    await query(`
      DELETE FROM Loans
      WHERE book_id = @bookId
    `, { bookId });


    const deleteBookResult = await query(`
      DELETE FROM Books
      WHERE book_id = @bookId
    `, { bookId });

    if (deleteBookResult.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Книга и все связанные записи о выдачах успешно удалены'
    });
  } catch (err) {
    console.error('Ошибка при удалении книги:', err);

    if (err.number === 547) {
      return res.status(400).json({
        success: false,
        message: 'Не удалось удалить книгу из-за связанных данных в таблице выдач'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении книги',
      error: err.message
    });
  }
});

module.exports = router;