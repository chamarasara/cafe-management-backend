import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: "root",
    password: "casperbuster",
    database: process.env.DEV_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "cafe_management_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "cafe_management_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
