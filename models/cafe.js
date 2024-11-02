'use strict';

import { v4 as uuidv4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const Cafes = sequelize.define(
    'Cafes',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );

  // Define association
  Cafes.associate = (models) => {
    Cafes.hasMany(models.Employee, { as: "Employee" });
  };

  return Cafes;
};
