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

// Initial Sequelize connection 
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize({
    dialect: 'mysql',
    port: 3306,
    host: 'host.docker.internal',
    username: config.username,
    password: config.password,
    database: 'mysql', 
  });
}

// Create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    // Check if the cafe_management database exists
    const [results] = await sequelize.query("SHOW DATABASES LIKE 'cafe_management'");

    if (results.length === 0) {
      // Create the database if it doesn't exist
      await sequelize.query("CREATE DATABASE `cafe_management`;");
      console.log('Database "cafe_management" created successfully.');
    } else {
      console.log('Database "cafe_management" already exists.');
    }
  } catch (error) {
    console.error('Error while checking/creating the database:', error.message);
    process.exit(1); 
  }
};

// Dynamically load models
const loadModels = async () => {
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

  // Add Cafe and Employee models to the db object after they're defined
  db.Cafes = Cafe(sequelize, Sequelize.DataTypes);
  db.Employee = Employee(sequelize, Sequelize.DataTypes);

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

// Re-initialize Sequelize with the correct database after ensuring it exists
const reconnectWithDatabase = async () => {
  try {
    sequelize = new Sequelize({
      dialect: 'mysql',
      port: 3306,
      host: 'host.docker.internal',
      username: config.username,
      password: config.password,
      database: 'cafe_management',  
    });

    await sequelize.authenticate();
    console.log('Connection to MySQL with "cafe_management" database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the "cafe_management" database:', error.message);
    process.exit(1);
  }
};

// Sync models with the database
const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log('Models synced successfully.');
  } catch (error) {
    console.error('Error syncing models:', error.message);
    process.exit(1);
  }
};

const initialize = async () => {
  await createDatabaseIfNotExists(); 
  await reconnectWithDatabase();      
  await loadModels();                
  await syncModels();                 
};

initialize();

export { sequelize };
export default db;
