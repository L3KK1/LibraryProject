// Точка входа (Entry point)

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json()); // Парсим JSON в запросах

// Логирование запросов (для отладки)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Маршруты
app.use("/api/books", require("./routes/books"));

// Тестовый endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API библиотеки работает!" });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Что-то пошло не так!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📚 API книг: http://localhost:${PORT}/api/books`);
});
