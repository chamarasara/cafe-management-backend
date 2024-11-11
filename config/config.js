import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,
  },
  test: {
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD, 
    database: process.env.TEST_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.PROD_DATABASE_USERNAME,
    password: process.env.PROD_DATABASE_PASSWORD, 
    database: process.env.PROD_DATABASE, 
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,
  },
};

export default config;
