'use strict';

import generateEmployeeId from '../utils/generateEmployeeId.js';

export default (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: generateEmployeeId,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[89]\d{7}$/, 
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      days_worked: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cafe_Id: {  
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Cafes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email_address', 'cafe_Id'], 
        },
      ],
      hooks: {
        beforeSave: (employee) => {
          if (employee.startDate) {
            const today = new Date();
            const startDate = new Date(employee.startDate);
            const timeDiff = today - startDate; 
            employee.days_worked = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 
          }
        },
      },
    }
  );

  Employee.associate = (models) => {
    Employee.belongsTo(models.Cafes, {
      foreignKey: 'cafe_Id',
      as: 'Cafes',
    });
  };

  return Employee;
};
