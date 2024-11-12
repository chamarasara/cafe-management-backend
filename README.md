# Cafe Backend

This is the backend for the Cafe Management application. It is built using Node.js, Express, and Sequelize ORM to manage the database.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
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

Run the following command to build the Docker:

```bash
docker-compose up --build
```

This will start the server, and you can access it at `http://localhost:4000`.


## Running Tests

To run the test cases, use the following command:

```bash
docker-compose run test
```

## License

This project is licensed under the MIT License.
