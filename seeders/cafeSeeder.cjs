'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cafes', [
      {
        id: uuidv4(),
        name: 'Cafe Mocha',
        location: 'Downtown',
        description: 'A cozy place for coffee lovers.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Cafe Latte',
        location: 'Uptown',
        description: 'Enjoy your latte with a view.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Cafe Espresso',
        location: 'Midtown',
        description: 'Strong coffee for a busy day.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Cafe Americano',
        location: 'Suburbs',
        description: 'A classic for all coffee enthusiasts.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cafes', null, {});
  },
};
