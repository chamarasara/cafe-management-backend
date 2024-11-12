'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        validate: {
          is: /^UI[a-zA-Z0-9]{7}$/  // Validating employee ID format
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Name is required
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false, // Email is required
        unique: true, // Enforce unique email for each employee
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false, // Phone number is required
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false, // Gender is required
      },
      cafe_Id: {
        type: Sequelize.UUID,
        allowNull: true, // Null allowed if no cafe assigned
        references: {
          model: 'Cafes', // Referencing the 'Cafes' table
          key: 'id', // Cafe's 'id' column
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Delete employee but keep their record
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
    });

    // Add an index on the email_address and cafeId columns for uniqueness
    await queryInterface.addIndex('Employees', ['email_address', 'cafe_Id'], {
      unique: true, // Ensure unique combination of email_address and cafeId
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table in the down migration
    await queryInterface.dropTable('Employees');
  }
};
