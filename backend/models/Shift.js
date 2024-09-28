const { Model, DataTypes } = require('sequelize');

class Shift extends Model {}

module.exports = (sequelize) => {
  Shift.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CB: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SC: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SP: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BC: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LF: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PP_BTC: { // Добавляем новое поле
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Other: { // Добавляем новое поле
      type: DataTypes.TEXT,
      allowNull: true,
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Operators',
        key: 'id',
      },
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Models',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Shift', // Название модели
  });

  Shift.associate = models => {
    Shift.belongsTo(models.Operator, { foreignKey: 'operatorId' }); // Ассоциация с Operator
    Shift.belongsTo(models.Model, { foreignKey: 'modelId' }); // Ассоциация с Model (имя модели должно совпадать)
  };

  return Shift;
};
