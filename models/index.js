import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import configFile from '../config/config.js';
import Cafe from './cafe.js';
import Employee from './employee.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {}; 

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: 'mysql',
  });
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of modelFiles) {
  const model = (await import(path.join(__dirname, file))).default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Add Cafe to the db object after it's defined
db.Cafe = Cafe(sequelize, Sequelize.DataTypes);
db.Employee = Employee(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export { sequelize };
export default db;
