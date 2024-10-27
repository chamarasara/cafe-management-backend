'use strict';

const generateEmployeeId = () => {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'UI';
  for (let i = 0; i < 7; i++) {
    id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return id;
};

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
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email_address', 'cafeId'],
        },
      ],
    }
  );

  Employee.associate = (models) => {
    Employee.belongsTo(models.Cafes, {
      foreignKey: 'cafeId', // Define the custom column name
      as: 'cafes',
    });
  };

  return Employee;
};
