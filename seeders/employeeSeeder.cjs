'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];
    for (let i = 0; i < 10; i++) {
      employees.push({
        id: uuidv4(),
        name: faker.person.fullName(),
        email_address: faker.internet.email(),
        phone_number: faker.phone.number('8########'),
        gender: faker.helpers.arrayElement(['male', 'female']),
        cafeId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Employees', employees);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
  },
};
