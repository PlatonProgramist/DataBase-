const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Подключение к базе данных

// Маршрут для получения статистики за месяц
router.get('/monthly-stats', async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;

  try {
    const query = `
      SELECT
        DATE(date) as day,
        COUNT(*) as shiftsPerDay,
        SUM("check") as totalEarnings
      FROM
        shifts
      WHERE
        strftime('%m', date) = ? AND strftime('%Y', date) = ?
      GROUP BY
        day
    `;

    const [results] = await db.query(query, [month.padStart(2, '0'), year]);

    const totalShiftsQuery = `
      SELECT
        COUNT(*) as totalShifts,
        SUM("check") as totalEarnings
      FROM
        shifts
      WHERE
        strftime('%m', date) = ? AND strftime('%Y', date) = ?
    `;
    const [totalResults] = await db.query(totalShiftsQuery, [month.padStart(2, '0'), year]);

    res.json({
      dailyStats: results,
      totalShifts: totalResults[0].totalShifts,
      totalEarnings: totalResults[0].totalEarnings,
    });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
