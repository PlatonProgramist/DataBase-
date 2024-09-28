module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Fanslies', 'operatorId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Operators', // Имя таблицы Operators
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Fanslies', 'modelId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Models', // Имя таблицы Models
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Fanslies', 'operatorId');
    await queryInterface.removeColumn('Fanslies', 'modelId');
  },
};
