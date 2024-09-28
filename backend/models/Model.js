const { Model, DataTypes } = require('sequelize');

class ModelName extends Model {}

module.exports = (sequelize) => {
  ModelName.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Model', // Название модели должно совпадать с именем в других местах
  });

  ModelName.associate = models => {
    ModelName.hasMany(models.Shift, { foreignKey: 'modelId' }); // Ассоциация с Shift
  };

  return ModelName;
};
