const express = require('express');
const router = express.Router();
const { Model, Operator, Shift } = require('../models');

// Получение общего рейтинга моделей
router.get('/models/ratings', async (req, res) => {
  try {
    const models = await Model.findAll({
      include: [{ model: Shift }],
    });

    const modelRatings = models.map((model) => {
      const shiftCount = model.Shifts.length;
      const totalCheck = model.Shifts.reduce((sum, shift) => sum + (shift.check || 0), 0); // Защита от null значений
      const rank = shiftCount && totalCheck ? shiftCount / totalCheck : 0;
      return {
        id: model.id,
        name: model.name,
        shiftCount,
        totalCheck,
        averageRating: rank ? rank.toFixed(2) : '0', // Средний показатель
      };
    });

    const sortedModelRatings = modelRatings.sort((a, b) => b.averageRating - a.averageRating); // Сортировка по среднему показателю
    res.json(sortedModelRatings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении рейтинга моделей' });
  }
});

// Получение общего рейтинга операторов
router.get('/operators/ratings', async (req, res) => {
  try {
    const operators = await Operator.findAll({
      include: [{ model: Shift }],
    });

    const operatorRatings = operators.map((operator) => {
      const shiftCount = operator.Shifts.length;
      const totalCheck = operator.Shifts.reduce((sum, shift) => sum + (shift.check || 0), 0); // Защита от null значений
      const rank = shiftCount && totalCheck ? shiftCount / totalCheck : 0;
      return {
        id: operator.id,
        name: operator.name,
        shiftCount,
        totalCheck,
        averageRating: rank ? rank.toFixed(2) : '0', // Средний показатель
      };
    });

    const sortedOperatorRatings = operatorRatings.sort((a, b) => b.averageRating - a.averageRating); // Сортировка по среднему показателю
    res.json(sortedOperatorRatings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении рейтинга операторов' });
  }
});

// Получение рейтинга для конкретной модели
router.get('/models/ratings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Model.findByPk(id, {
      include: [{ model: Shift }],
    });

    if (!model) return res.status(404).json({ error: 'Модель не найдена' });

    const shiftCount = model.Shifts.length;
    const totalCheck = model.Shifts.reduce((sum, shift) => sum + (shift.check || 0), 0);
    const rank = shiftCount && totalCheck ? shiftCount / totalCheck : 0;

    res.json({
      shiftCount,
      totalCheck,
      averageRating: rank ? rank.toFixed(2) : '0', // Средний показатель
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении рейтинга модели' });
  }
});

// Получение рейтинга для конкретного оператора
router.get('/operators/ratings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const operator = await Operator.findByPk(id, {
      include: [{ model: Shift }],
    });

    if (!operator) return res.status(404).json({ error: 'Оператор не найден' });

    const shiftCount = operator.Shifts.length;
    const totalCheck = operator.Shifts.reduce((sum, shift) => sum + (shift.check || 0), 0);
    const rank = shiftCount && totalCheck ? shiftCount / totalCheck : 0;

    res.json({
      shiftCount,
      totalCheck,
      averageRating: rank ? rank.toFixed(2) : '0', // Средний показатель
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении рейтинга оператора' });
  }
});

module.exports = router;
