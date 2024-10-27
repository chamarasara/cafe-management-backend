'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Employees', 'startDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn('Employees', 'days_worked', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Employees', 'startDate');
    await queryInterface.removeColumn('Employees', 'days_worked');
  },
};
