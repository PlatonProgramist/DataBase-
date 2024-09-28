const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Fansly extends Model {}

  Fansly.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Fansly',
    tableName: 'Fanslies',  // Добавь явное указание имени таблицы
  });

  Fansly.associate = (models) => {
    Fansly.belongsTo(models.Operator, { foreignKey: 'operatorId' });
    Fansly.belongsTo(models.Model, { foreignKey: 'modelId' });
  };

  return Fansly;
};
