// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./models'); // Убедитесь, что импортируются необходимые модели
const earningsRoutes = require('./routes/earnings');
const ratingRoutes = require('./routes/ratings'); // Импорт маршрутов рейтинга
const monthlyEarningsRoutes = require('./routes/monthlyEarnings'); // Импорт маршрута для ежемесячного заработка

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсинга JSON и CORS
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Убедитесь, что этот URL соответствует фронтенду
}));

// Подключение маршрутов API
app.use('/api/operators', require('./routes/operators'));
app.use('/api/models', require('./routes/models'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/fansly', require('./routes/fansly')); // Маршрут для Fansly
app.use('/api/earnings', earningsRoutes); // Маршрут для ежедневного заработка
app.use('/api/monthly-earnings', require('./routes/monthlyEarnings'));
app.use('/api/ratings', ratingRoutes); // Маршрут для рейтинга

// Подключение статических файлов (фронтенд)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Обработка всех остальных маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Запуск сервера
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Обернул строку в backticks
  
  try {
    // Тестирование соединения с базой данных
    await sequelize.authenticate();
    console.log('Database connected!');

    // Синхронизация моделей с базой данных
    await sequelize.sync(); // Удалите { alter: true }
    console.log('Database synchronized!');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
