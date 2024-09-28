const express = require('express');
const { Shift } = require('../models');
const { Op } = require('sequelize'); // Импортируем оператор для поиска по диапазону дат
const router = express.Router();

// Маршрут для получения ежедневного дохода
router.get('/daily', async (req, res) => {
  try {
    const shifts = await Shift.findAll();
    console.log('Shifts retrieved from the database:', shifts); // Отладочное сообщение

    const earningsByDate = {};

    shifts.forEach((shift) => {
      const shiftDate = new Date(shift.date);

      // Проверяем, является ли дата валидной
      if (!isNaN(shiftDate.getTime())) {
        const formattedDate = shiftDate.toISOString().split('T')[0]; // Берем только дату, без времени

        if (!earningsByDate[formattedDate]) {
          earningsByDate[formattedDate] = 0;
        }
        earningsByDate[formattedDate] += shift.check || 0; // Суммируем check за день
      }
    });

    // Преобразуем объект в массив и сортируем по дате в обратном порядке
    const dailyEarnings = Object.keys(earningsByDate)
      .map((date) => ({
        date,
        totalCheck: earningsByDate[date],
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортируем даты в обратном порядке

    console.log('Daily earnings calculated:', dailyEarnings); // Отладочное сообщение
    res.json(dailyEarnings);
  } catch (error) {
    console.error('Ошибка при получении ежедневного дохода:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении ежедневного дохода' });
  }
});

// Маршрут для получения месячного дохода
router.get('/monthly', async (req, res) => {
  try {
    const { month, year } = req.query; // Ожидаем месяц и год в запросе

    if (!month || !year) {
      return res.status(400).json({ error: 'Необходимо указать месяц и год' });
    }

    const startDate = new Date(year, month - 1, 1); // Начало месяца
    const endDate = new Date(year, month, 0); // Конец месяца

    console.log('Fetching shifts between:', startDate, 'and', endDate); // Отладочное сообщение

    const shifts = await Shift.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate], // Поиск смен за выбранный месяц
        },
      },
    });

    console.log('Shifts found for the month:', shifts); // Отладочное сообщение

    let totalEarnings = 0;
    let shiftCount = 0;

    shifts.forEach((shift) => {
      totalEarnings += shift.check || 0; // Суммируем общий заработок
      shiftCount++; // Считаем количество смен
    });

    const averageEarnings = shiftCount > 0 ? totalEarnings / shiftCount : 0; // Средний заработок

    res.json({
      totalEarnings, // Общий заработок
      shiftCount, // Количество смен
      averageEarnings, // Средний заработок за смену
    });
  } catch (error) {
    console.error('Ошибка при получении месячного дохода:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении месячного дохода' });
  }
});

module.exports = router;
