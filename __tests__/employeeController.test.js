import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js'; 
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

describe('POST /api/employee', () => {
    beforeEach(async () => {
        // Clean up the database before each test
        await db.Employee.destroy({ where: {} });
    });

    it('should create an employee and return it', async () => {
        const newEmployeeData = {
            name: 'John Doe',
            email_address: 'john.doe@example.com',
            phone_number: '91234567',
            gender: 'Male',
            cafeId: uuidv4(), 
        };

        const res = await request(app)
            .post('/api/employee')
            .send(newEmployeeData);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message', 'Employee created successfully');
        expect(res.body.employee).to.include(newEmployeeData);
    });

    it('should return 400 if employee email already exists', async () => {
        const existingEmployeeData = {
            name: 'Jane Doe',
            email_address: 'jane.doe@example.com',
            phone_number: '91234567',
            gender: 'Female',
            cafeId: uuidv4(),
        };

        // Create the first employee
        await request(app)
            .post('/api/employee')
            .send(existingEmployeeData);

        // Attempt to create a second employee with the same email
        const duplicateEmployeeData = {
            name: 'John Smith',
            email_address: 'jane.doe@example.com', 
            phone_number: '98765432',
            gender: 'Male',
            cafeId: uuidv4(),
        };

        const res = await request(app)
            .post('/api/employee')
            .send(duplicateEmployeeData);

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message', 'An employee with this email already exists in another cafe.');
    });

    it('should return 400 if required fields are missing', async () => {
        const invalidEmployeeData = {
            // Missing required fields
            email_address: 'invalid.email',
            phone_number: '91234567',
        };

        const res = await request(app)
            .post('/api/employee')
            .send(invalidEmployeeData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if phone number format is invalid', async () => {
        const invalidPhoneData = {
            name: 'Invalid Phone',
            email_address: 'invalid.phone@example.com',
            phone_number: '12345678', 
            gender: 'Other',
            cafeId: uuidv4(),
        };

        const res = await request(app)
            .post('/api/employee')
            .send(invalidPhoneData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if gender is not provided', async () => {
        const missingGenderData = {
            name: 'No Gender',
            email_address: 'no.gender@example.com',
            phone_number: '91234567',
            cafeId: uuidv4(),
        };

        const res = await request(app)
            .post('/api/employee')
            .send(missingGenderData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if cafeId is not provided', async () => {
        const missingCafeIdData = {
            name: 'No Cafe',
            email_address: 'no.cafe@example.com',
            phone_number: '91234567',
            gender: 'Female',
        };

        const res = await request(app)
            .post('/api/employee')
            .send(missingCafeIdData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });
});

describe('PUT /api/employee/:id', () => {
    let employeeId;

    beforeEach(async () => {
        // Clean up the database before each test
        await db.Employee.destroy({ where: {} });
    
        // Create a test employee to update
        const employee = await db.Employee.create({
            id: uuidv4(), 
            name: 'John Doe',
            email_address: 'john.doe@example.com',
            phone_number: '91234567',
            gender: 'Male',
            cafeId: uuidv4(), 
            startDate: new Date(),
        });
        employeeId = employee.id;
    });

    it('should update an employee and return the updated employee', async () => {
        const updatedEmployeeData = {
            name: 'John Smith',
            email_address: 'john.smith@example.com',
            phone_number: '98765432',
            gender: 'Male',
            cafeId: uuidv4(), 
        };

        const res = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(updatedEmployeeData);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Employee updated successfully.');
        expect(res.body.employee).to.include(updatedEmployeeData);
    });

    it('should return 400 if required fields are missing', async () => {
        const invalidEmployeeData = {
            // Missing required fields
            email_address: 'invalid.email@example.com',
            phone_number: '91234567',
        };

        const res = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(invalidEmployeeData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if phone number format is invalid', async () => {
        const invalidPhoneData = {
            name: 'Invalid Phone',
            email_address: 'invalid.phone@example.com',
            phone_number: '12345678', // Invalid phone number
            gender: 'Other',
            cafeId: uuidv4(),
        };

        const res = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(invalidPhoneData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if gender is not provided', async () => {
        const missingGenderData = {
            name: 'No Gender',
            email_address: 'no.gender@example.com',
            phone_number: '91234567',
            // Missing gender field
            cafeId: uuidv4(),
        };

        const res = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(missingGenderData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('should return 400 if cafeId is not provided', async () => {
        const missingCafeIdData = {
            name: 'No Cafe',
            email_address: 'no.cafe@example.com',
            phone_number: '91234567',
            gender: 'Female',
            // Missing cafeId
        };

        const res = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(missingCafeIdData);

        expect(res.status).to.equal(400);
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });
});

describe('DELETE /api/employee/:id', () => {
    let employeeId;

    // Before each test, create a sample employee
    beforeEach(async () => {
        const employee = await db.Employee.create({
            name: 'Test Employee',
            email_address: 'test@example.com',
            phone_number: '91234567',
            gender: 'Male',
            cafeId: 'someCafeId', // Use a valid cafeId
            startDate: new Date(), 
        });
        employeeId = employee.id; 
    });

    afterEach(async () => {
        // Delete the employee created during the test
        await db.Employee.destroy({ where: { id: employeeId } });
    });

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

