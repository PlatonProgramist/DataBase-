const express = require('express');
const router = express.Router();
const { Operator, Shift, Model } = require('../models');

// Получение всех операторов
router.get('/', async (req, res) => {
  try {
    const operators = await Operator.findAll();
    res.json(operators);
  } catch (error) {
    console.error('Ошибка при получении операторов:', error);
    res.status(500).json({ error: 'Ошибка получения операторов.' });
  }
});

// Добавление нового оператора
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Поле name обязательно.' });
    }

    const newOperator = await Operator.create({ name });
    res.status(201).json(newOperator);
  } catch (error) {
    console.error('Ошибка при добавлении оператора:', error);
    res.status(500).json({ error: 'Ошибка при создании оператора.' });
  }
});

// Получение всех смен для конкретного оператора
router.get('/:operatorId/shifts', async (req, res) => {
  try {
    const { operatorId } = req.params;

    const shifts = await Shift.findAll({
      where: { operatorId },
      include: [
        { model: Operator, attributes: ['name'] },
        { model: Model, attributes: ['name'] }
      ],
      attributes: ['date', 'check', 'CB', 'SC', 'SP', 'BC', 'LF', 'PP_BTC', 'Other']
    });

    res.json(shifts);
  } catch (error) {
    console.error('Ошибка при получении смен оператора:', error);
    res.status(500).json({ error: 'Ошибка получения смен.' });
  }
});

// Получение рейтинга оператора
router.get('/:id/rating', async (req, res) => {
  try {
    const operatorId = req.params.id;

    const shifts = await Shift.findAll({ where: { operatorId } });
    const totalCheck = shifts.reduce((sum, shift) => sum + shift.check, 0);
    const shiftCount = shifts.length;
    const averageRating = shiftCount ? (totalCheck / shiftCount) : 0;

    res.json({ shiftCount, totalCheck, averageRating });
  } catch (error) {
    console.error('Ошибка при получении рейтинга оператора:', error);
    res.status(500).json({ error: 'Ошибка при получении рейтинга оператора.' });
  }
});

// Получение рейтингов всех операторов
router.get('/ratings', async (req, res) => {
  try {
    const operators = await Operator.findAll({
      include: [{ model: Shift }],
    });

    const ratings = operators.map(operator => {
      const totalCheck = operator.Shifts.reduce((sum, shift) => sum + shift.check, 0);
      const shiftCount = operator.Shifts.length;
      const averageRating = shiftCount ? (totalCheck / shiftCount) : 0;

      return {
        id: operator.id,
        name: operator.name,
        totalCheck,
        shifts: shiftCount,
        averageRating,
      };
    });

    res.json(ratings);
  } catch (error) {
    console.error('Ошибка при получении рейтингов операторов:', error);
    res.status(500).json({ error: 'Ошибка получения рейтингов операторов.' });
  }
});

module.exports = router;
