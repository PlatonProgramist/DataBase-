const express = require('express');
const router = express.Router();
const { Model, Shift, Operator } = require('../models');

// Получение всех моделей
router.get('/', async (req, res) => {
  try {
    const models = await Model.findAll();
    res.json(models);
  } catch (error) {
    console.error('Ошибка при получении моделей:', error);
    res.status(500).json({ error: 'Ошибка получения моделей.' });
  }
});

// Добавление новой модели
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Поле name обязательно.' });
    }

    const newModel = await Model.create({ name });
    res.status(201).json(newModel);
  } catch (error) {
    console.error('Ошибка при добавлении модели:', error);
    res.status(500).json({ error: 'Ошибка при создании модели.' });
  }
});

// Получение всех смен для конкретной модели
router.get('/:modelId/shifts', async (req, res) => {
  try {
    const { modelId } = req.params;

    const shifts = await Shift.findAll({
      where: { modelId },
      include: [
        { model: Operator, attributes: ['name'] },
        { model: Model, attributes: ['name'] }
      ],
      attributes: ['date', 'check', 'CB', 'SC', 'SP', 'BC', 'LF', 'PP_BTC', 'Other']
    });

    res.json(shifts);
  } catch (error) {
    console.error('Ошибка при получении смен модели:', error);
    res.status(500).json({ error: 'Ошибка получения смен.' });
  }
});

// Получение рейтинга модели
router.get('/:id/rating', async (req, res) => {
  try {
    const modelId = req.params.id;

    const shifts = await Shift.findAll({
      where: { modelId },
      attributes: ['check']
    });

    const totalCheck = shifts.reduce((sum, shift) => sum + shift.check, 0);
    const shiftCount = shifts.length;
    const averageRating = shiftCount ? (totalCheck / shiftCount) : 0;

    res.json({ shiftCount, totalCheck, averageRating });
  } catch (error) {
    console.error('Ошибка при получении рейтинга модели:', error);
    res.status(500).json({ error: 'Ошибка при получении рейтинга модели.' });
  }
});

// Получение рейтингов всех моделей
router.get('/ratings', async (req, res) => {
  try {
    const models = await Model.findAll({
      include: [{ model: Shift }],
    });

    const ratings = models.map(model => {
      const totalCheck = model.Shifts.reduce((sum, shift) => sum + shift.check, 0);
      const shiftCount = model.Shifts.length;
      const averageRating = shiftCount ? (totalCheck / shiftCount) : 0;

      return {
        id: model.id,
        name: model.name,
        totalCheck,
        shifts: shiftCount,
        averageRating,
      };
    });

    res.json(ratings);
  } catch (error) {
    console.error('Ошибка при получении рейтингов моделей:', error);
    res.status(500).json({ error: 'Ошибка получения рейтингов моделей.' });
  }
});

module.exports = router;
