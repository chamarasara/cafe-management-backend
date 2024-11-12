import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js'; 
import { Sequelize } from 'sequelize';
import Cafe from '../models/cafe.js';
import Employee from '../models/employee.js';

const sequelize = new Sequelize('mysql', 'root', 'casperbuster', {
  host: 'host.docker.internal',
  dialect: 'mysql', 
});

const db = {}; 
db.Cafes = Cafe(sequelize, Sequelize.DataTypes);
db.Employee = Employee(sequelize, Sequelize.DataTypes);

describe('Employee Routes', () => {
    let employeeId;

    describe('POST /api/employee', () => {
        it('should create a new employee and return it', async () => {
            const newEmployee = {
                name: 'John Doe',
                email_address: 'john@example.com',
                phone_number: '91234567',
                gender: 'Male',
                cafeId: 'someCafeId', 
                startDate: new Date(), 
            };

            const res = await request(app)
                .post('/api/employee')
                .send(newEmployee);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Employee created successfully');
            expect(res.body).to.have.property('employee');
            employeeId = res.body.employee.id; // Save the created employee's ID for future tests
        });

        it('should return 400 for validation errors', async () => {
            const invalidEmployee = {
                name: '', // Missing name
                email_address: 'invalid-email', // Invalid email
                phone_number: '123', // Invalid phone number
                gender: 'Male',
                cafeId: '', // Missing cafeId
            };

            const res = await request(app)
                .post('/api/employee')
                .send(invalidEmployee);

            expect(res.status).to.equal(400);
            expect(res.body.errors).to.be.an('array');
        });
    });

    describe('PUT /api/employee/:id', () => {
        it('should update an employee and return the updated employee', async () => {
            const updatedEmployeeData = {
                name: 'John Smith',
                email_address: 'johnsmith@example.com',
                phone_number: '91234567',
                gender: 'Male',
                cafeId: 'someCafeId',
            };

            const res = await request(app)
                .put(`/api/employee/${employeeId}`)
                .send(updatedEmployeeData);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Employee updated successfully.');
            expect(res.body.employee).to.include(updatedEmployeeData);
        });

        it('should return 400 for validation errors', async () => {
            const res = await request(app)
                .put(`/api/employee/${employeeId}`)
                .send({ email_address: 'invalid-email' }); // Invalid email

            expect(res.status).to.equal(400);
            expect(res.body.errors).to.be.an('array');
        });
    });

    describe('DELETE /api/employee/:id', () => {
        it('should delete an employee and return a success message', async () => {
            const res = await request(app)
                .delete(`/api/employee/${employeeId}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Employee deleted successfully.');

            // Verify that the employee was actually deleted
            const deletedEmployee = await db.Employee.findByPk(employeeId);
            expect(deletedEmployee).to.be.null; 
        });

        it('should return 404 if employee not found', async () => {
            const nonExistentId = 'nonExistentEmployeeId'; // An ID that does not exist in the database
            const res = await request(app)
                .delete(`/api/employee/${nonExistentId}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Employee not found.');
        });
    });
});
