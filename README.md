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

2. Build the Docker image:

   ```bash
   docker build -t cafe-backend .
   ```

## Running the Application

To run the application using Docker, execute the following command:

```bash
docker run -p 3000:3000 cafe-backend
```

This will start the server, and you can access it at `http://localhost:3000`.

## Database Migrations

To run the database migrations, execute the following command inside your Docker container:

```bash
docker run cafe-backend npx sequelize-cli db:migrate
```

## Seeding the Database

To seed the database, run the following command:

```bash
docker run cafe-backend npx sequelize-cli db:seed:all
```

## Running Tests

To run the test cases, use the following command:

```bash
docker run cafe-backend npm test
```

Alternatively, if you want to run tests using Mocha specifically, you can run:

```bash
docker run cafe-backend npx mocha
```

## License

This project is licensed under the MIT License.
