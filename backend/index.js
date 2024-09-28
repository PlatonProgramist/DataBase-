// backend/index.js
const express = require('express');
const app = express();
const path = require('path');
const { sequelize } = require('./models');  // Подключение базы данных

// Подключение маршрутов
const operatorsRouter = require('./routes/operators');
const modelsRouter = require('./routes/models');
const shiftsRouter = require('./routes/shifts');
const fanslyRouter = require('./routes/fansly');

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use('/api/operators', operatorsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/fansly', fanslyRouter);

// Запуск сервера и синхронизация с базой данных
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.sync(); // Применение изменений к базе данных
    console.log('Database connected!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

