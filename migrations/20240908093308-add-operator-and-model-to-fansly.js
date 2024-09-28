'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Все операции внутри асинхронной функции
    await queryInterface.addColumn('Fanslies', 'operatorId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Operators',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Fanslies', 'modelId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Models',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Операции отката (удаление столбцов)
    await queryInterface.removeColumn('Fanslies', 'operatorId');
    await queryInterface.removeColumn('Fanslies', 'modelId');
  }
};
