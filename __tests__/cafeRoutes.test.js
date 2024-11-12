import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js'; 
import { v4 as uuidv4 } from 'uuid';
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

describe('Cafe Routes', () => {

  beforeEach(async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.Cafes.destroy({ where: {}, truncate: true });
    await db.Employee.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/cafe', () => {
    it('should create a new cafe and return it', async () => {
      const cafeData = {
        name: 'Test Cafe',
        description: 'A test cafe.',
        logo: 'test_logo.png',
        location: 'Test Location',
      };

      const res = await request(app)
        .post('/api/cafe')
        .send(cafeData);

      expect(res.status).to.equal(201);
      expect(res.body).to.include(cafeData);
    });

    it('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/api/cafe')
        .send({}); 

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
    });
  });

  describe('GET /api/cafes', () => {
    it('should retrieve all cafes', async () => {
      const cafeData = {
        name: 'Test Cafe',
        description: 'A test cafe.',
        logo: 'test_logo.png',
        location: 'Test Location',
      };

      await db.Cafes.create(cafeData);

      const res = await request(app).get('/api/cafes');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.has.lengthOf(1);
      expect(res.body[0]).to.include(cafeData);
    });
  });
  

  describe('DELETE /api/cafe/:id', () => {
    it('should delete a cafe and return success message', async () => {
      const cafe = await db.Cafes.create({
        id: uuidv4(),
        name: 'Cafe to Delete',
        description: 'This cafe will be deleted.',
        logo: 'delete_logo.png',
        location: 'Location to Delete',
      });

      const res = await request(app).delete(`/api/cafe/${cafe.id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Cafe and associated employees deleted successfully.');
    });

    it('should return 404 if cafe not found', async () => {
      const res = await request(app).delete(`/api/cafe/${uuidv4()}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Cafe not found.');
    });
  });

  describe('GET /api/cafes/:cafeId/employees', () => {
    it('should return employees if cafe exists and has employees', async () => {
      const cafe = await db.Cafes.create({
        id: uuidv4(),
        name: 'Cafe with Employees',
        description: 'A cafe with employees.',
        logo: 'employees_logo.png',
        location: 'Busy City',
      });

      const employee1 = await db.Employee.create({
        id: uuidv4(),
        name: 'Employee One',
        email_address: 'employee1@test.com',
        cafeId: cafe.id,
        gender: "Male",
        phone_number: "91234567",
        startDate: new Date(),
        days_worked: 5,
      });

      const employee2 = await db.Employee.create({
        id: uuidv4(),
        name: 'Employee Two',
        email_address: 'employee2@test.com',
        cafeId: cafe.id,
        gender: "Male",
        phone_number: "91234567",
        startDate: new Date(),
        days_worked: 10,
      });

      const res = await request(app).get(`/api/cafes/${cafe.id}/employees`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.has.lengthOf(2);
    });

    it('should return 404 if cafe does not exist', async () => {
      const res = await request(app).get(`/api/cafes/${uuidv4()}/employees`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Cafe not found.');
    });
  });
});
