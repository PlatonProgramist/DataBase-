const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Подключаем ваш экземпляр Sequelize

const models = {};

// Путь к папке с моделями
const modelsPath = path.join(__dirname);

// Чтение всех файлов в папке models, кроме index.js
fs.readdirSync(modelsPath)
  .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model; // Добавляем модель в объект models
  });

// Инициализация связей (associations), если они определены в модели
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Экспортируем объект с моделями и самим sequelize
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
