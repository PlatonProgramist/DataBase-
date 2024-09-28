const express = require('express');
const router = express.Router();
const { Shift, Operator, Model } = require('../models');
const { format, parseISO } = require('date-fns');
const { Op } = require('sequelize'); // Для работы с диапазоном дат

// Функция форматирования даты
const formatDate = (date) => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) throw new Error('Invalid date format');
    return format(parsedDate, 'yyyy-MM-dd HH:mm'); // Пример формата
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return date; // Возвращаем исходное значение в случае ошибки
  }
};

// Создание новой смены
router.post('/', async (req, res) => {
  try {
    const { date, check, CB, SC, SP, BC, LF, PP_BTC, Other, operatorId, modelId } = req.body;

    console.log('Полученные данные для создания смены:', req.body);

    if (!date || check === undefined || !operatorId || !modelId) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля.' });
    }

    const operator = await Operator.findByPk(operatorId);
    if (!operator) {
      return res.status(404).json({ error: `Оператор с ID ${operatorId} не найден.` });
    }

    const model = await Model.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ error: `Модель с ID ${modelId} не найдена.` });
    }

    const shift = await Shift.create({
      date,
      check,
      CB,
      SC,
      SP,
      BC,
      LF,
      PP_BTC,
      Other,
      operatorId,
      modelId,
    });

    console.log('Смена успешно создана:', shift);
    res.status(201).json(shift);
  } catch (error) {
    console.error('Ошибка при создании смены:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
});

// Получение всех смен с сортировкой
router.get('/', async (req, res) => {
  try {
    const { sortField = 'date', sortOrder = 'asc' } = req.query;

    const shifts = await Shift.findAll({
      include: [
        { model: Operator, as: 'Operator' },
        { model: Model, as: 'Model' }
      ],
      order: [[sortField, sortOrder.toUpperCase()]]
    });

    // Форматирование дат
    const formattedShifts = shifts.map(shift => ({
      ...shift.toJSON(),
      date: formatDate(shift.date) // Применение форматирования
    }));

    res.json(formattedShifts);
  } catch (error) {
    console.error('Ошибка при получении смен:', error);
    res.status(500).json({ error: 'Не удалось получить смены.' });
  }
});

// Новый маршрут для получения смен за выбранный месяц
router.get('/month', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Не указан месяц.' });
    }

    // Формируем начало и конец месяца
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0); // Установить последний день месяца

    // Получаем смены за выбранный месяц
    const shifts = await Shift.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        { model: Operator, as: 'Operator' },
        { model: Model, as: 'Model' }
      ],
      order: [['date', 'ASC']] // Сортировка по дате
    });

    const formattedShifts = shifts.map(shift => ({
      ...shift.toJSON(),
      date: formatDate(shift.date)
    }));

    res.json(formattedShifts);
  } catch (error) {
    console.error('Ошибка при получении смен за месяц:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение всех операторов
router.get('/operators', async (req, res) => {
  try {
    const operators = await Operator.findAll();
    res.json(operators);
  } catch (error) {
    console.error('Ошибка при получении операторов:', error);
    res.status(500).json({ error: 'Не удалось получить операторов.' });
  }
});

// Получение всех моделей
router.get('/models', async (req, res) => {
  try {
    const models = await Model.findAll();
    res.json(models);
  } catch (error) {
    console.error('Ошибка при получении моделей:', error);
    res.status(500).json({ error: 'Не удалось получить модели.' });
  }
});

// Обновление смены по ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, check, CB, SC, SP, BC, LF, PP_BTC, Other, operatorId, modelId } = req.body;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ error: 'Смена не найдена.' });
    }

    if (operatorId) {
      const operator = await Operator.findByPk(operatorId);
      if (!operator) {
        return res.status(404).json({ error: `Оператор с ID ${operatorId} не найден.` });
      }
    }

    if (modelId) {
      const model = await Model.findByPk(modelId);
      if (!model) {
        return res.status(404).json({ error: `Модель с ID ${modelId} не найдена.` });
      }
    }

    // Обновляем поля смены только если они были переданы
    shift.date = date || shift.date;
    shift.check = check || shift.check;
    shift.CB = CB || shift.CB;
    shift.SC = SC || shift.SC;
    shift.SP = SP || shift.SP;
    shift.BC = BC || shift.BC;
    shift.LF = LF || shift.LF;
    shift.PP_BTC = PP_BTC || shift.PP_BTC;  // Добавлено
    shift.Other = Other || shift.Other;      // Добавлено
    shift.operatorId = operatorId || shift.operatorId;
    shift.modelId = modelId || shift.modelId;

    await shift.save();
    res.json(shift);
  } catch (error) {
    console.error('Ошибка при обновлении смены:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
});

// Удаление смены по ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await Shift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ error: 'Смена не найдена.' });
    }
    await shift.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении смены:', error);
    res.status(500).json({ error: 'Не удалось удалить смену.' });
  }
});

module.exports = router;
