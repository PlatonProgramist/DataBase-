module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shifts', 'PP_BTC', {
      type: Sequelize.INTEGER,
      allowNull: true, // Или false, в зависимости от ваших требований
    });
    await queryInterface.addColumn('Shifts', 'Other', {
      type: Sequelize.STRING, // Или другой тип данных, в зависимости от ваших требований
      allowNull: true, // Или false, в зависимости от ваших требований
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shifts', 'PP_BTC');
    await queryInterface.removeColumn('Shifts', 'Other');
  },
};
