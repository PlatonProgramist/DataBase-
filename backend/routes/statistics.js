const express = require('express');
const router = express.Router();
const { Shift } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Существующий роут для получения статистики по модели или оператору
router.get('/', async (req, res) => {
  try {
    const { modelId, operatorId } = req.query;
    let where = {};

    if (modelId) where.modelId = modelId;
    if (operatorId) where.operatorId = operatorId;

    // Обновляем атрибуты, чтобы включить 'PP_BTC' и 'Other'
    const shifts = await Shift.findAll({
      where,
      attributes: ['date', 'check', 'CB', 'SC', 'SP', 'BC', 'LF', 'PP_BTC', 'Other'], // Включаем нужные поля
    });

    res.json(shifts);
  } catch (error) {
    console.error('Ошибка при получении данных статистики:', error);
    res.status(500).json({ error: 'Не удалось получить данные статистики.' });
  }
});

// Новый роут для получения доходов по дням с диапазоном дат
const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7)); // Последние 7 дней
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Последний месяц
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Последний год
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7)); // По умолчанию неделя
  }

  return startDate;
};

router.get('/daily-earnings', async (req, res) => {
  try {
    const { range } = req.query; // Получаем диапазон (неделя, месяц, год)
    const startDate = getDateRange(range); // Вычисляем начальную дату

    const dailyEarnings = await Shift.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), 'date'], // Группируем по дате
        [sequelize.fn('SUM', sequelize.col('check')), 'totalCheck'], // Суммируем чеки за каждый день
        [sequelize.fn('SUM', sequelize.col('PP_BTC')), 'totalPP_BTC'], // Суммируем PP_BTC
        [sequelize.fn('SUM', sequelize.col('Other')), 'totalOther'] // Суммируем Other
      ],
      where: {
        date: {
          [Op.gte]: startDate.toISOString().split('T')[0] // Фильтрация по дате начала
        }
      },
      group: ['date'], // Группируем по дате
      order: [['date', 'ASC']] // Сортируем по возрастанию даты
    });

    // Форматирование даты в строку
    const formattedEarnings = dailyEarnings.map(record => {
      const date = record.date ? new Date(record.date) : new Date();
      return {
        date: date.toISOString().split('T')[0], // Форматируем дату в 'YYYY-MM-DD'
        totalCheck: record.totalCheck,
        totalPP_BTC: record.totalPP_BTC,
        totalOther: record.totalOther
      };
    });

    res.json(formattedEarnings);
  } catch (error) {
    console.error('Ошибка при получении ежедневного дохода:', error);
    res.status(500).json({ error: 'Ошибка получения ежедневного дохода.' });
  }
});

module.exports = router;
