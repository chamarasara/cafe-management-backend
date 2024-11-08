# Cafe Backend

This is the backend for the Cafe Management application. It is built using Node.js, Express, and Sequelize ORM to manage the database.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [Seeding the Database](#seeding-the-database)
- [Running Tests](#running-tests)
- [License](#license)

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/chamarasara/cafe-management-backend.git
   cd cafe-management-backend
   ```
2. Install the required packages:
```bash
   yarn install
   ```

## Running the Application

Please take a copy from .env.sample. Create MySQL database and .env file and add database credentials to .env file. 
To run the application, execute the following command:

```bash
yarn dev
```

This will start the server, and you can access it at `http://localhost:4000`.

## Database Migrations

To run the database migrations, execute the following command:

```bash
npx sequelize-cli db:migrate
```

## Seeding the Database

To seed the database, run the following command:

```bash
npx sequelize-cli db:seed:all
```

## Running Tests

To run the test cases, use the following command:

```bash
yarn test
```

## License

This project is licensed under the MIT License.
