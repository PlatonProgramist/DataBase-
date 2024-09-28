'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE Shifts
      SET date = SUBSTR(date, 1, 16)
      WHERE date LIKE '____-__-__ __:__:__%';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Если нужно, добавьте код для отката изменений
  }
};
