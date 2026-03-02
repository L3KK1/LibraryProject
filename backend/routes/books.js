const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// GET /api/books - получить все книги
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM Books ORDER BY book_id");

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (err) {
    console.error("Ошибка при получении книг:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении книг",
      error: err.message,
    });
  }
});

module.exports = router;
