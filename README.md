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

To build and run the Docker image, ensure you have [Docker](https://www.docker.com/get-started) installed on your machine.

1. Clone the repository:
```bash
   git clone https://github.com/chamarasara/cafe-management-backend.git
   cd cafe-management
   ```
2. Install the required packages:
```bash
   yarn install
   ```

## Running the Application

To run the application using Docker, execute the following command:

```bash
yarn dev
```

This will start the server, and you can access it at `http://localhost:4000`.

## Database Migrations

Create MySQL database and add database credentials to .env file from .env.sample

To run the database migrations, execute the following command inside your Docker container:

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
