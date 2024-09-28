const { Model, DataTypes } = require('sequelize');

class Operator extends Model {}

module.exports = (sequelize) => {
  Operator.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Operator',  // Название модели должно совпадать с названием таблицы
  });

  Operator.associate = models => {
    Operator.hasMany(models.Shift, { foreignKey: 'operatorId' }); // Ассоциация с моделью Shift
  };

  return Operator;
};
