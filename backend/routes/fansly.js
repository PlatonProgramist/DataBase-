const express = require('express');
const router = express.Router();
const { Fansly, Operator, Model } = require('../models');

// Создание записи Fansly
router.post('/', async (req, res) => {
  try {
    const { date, check, operatorId, modelId } = req.body;

    console.log('Получены данные для создания записи:', { date, check, operatorId, modelId });

    const operator = await Operator.findByPk(operatorId);
    const model = await Model.findByPk(modelId);

    if (!operator || !model) {
      console.log('Оператор или модель не найдены');
      return res.status(404).json({ error: 'Оператор или модель не найдены.' });
    }

    const newRecord = await Fansly.create({
      date,
      check,
      operatorId,
      modelId
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Ошибка при создании записи Fansly:', error);
    res.status(500).json({ error: 'Ошибка создания записи.' });
  }
});

// Получение всех записей Fansly
router.get('/', async (req, res) => {
  try {
    const records = await Fansly.findAll({
      include: [
        { model: Operator, attributes: ['name'] },  // Включаем имя оператора
        { model: Model, attributes: ['name'] }      // Включаем имя модели
      ]
    });

    if (!records.length) {
      return res.status(404).json({ message: 'Нет записей Fansly.' });
    }

    console.log('Записи Fansly успешно получены:', records);
    res.json(records);
  } catch (error) {
    console.error('Ошибка при получении записей Fansly:', error);
    res.status(500).json({ error: 'Ошибка получения записей.' });
  }
});

module.exports = router;
