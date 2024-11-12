import { expect } from 'chai';
import request from 'supertest';
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

describe('Cafe Controller', () => {
  before(async () => {
    // Synchronize all models and create tables in the in-memory DB
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.Cafes.destroy({ where: {}, truncate: true });
    await db.Employee.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('GET /cafes', () => {
    it('should retrieve all cafes when no location is provided', async () => {
      // Create some cafes
      const cafes = [
        { id: uuidv4(), name: 'Cafe One', description: 'First Cafe', logo: 'logo1.png', location: 'New York' },
        { id: uuidv4(), name: 'Cafe Two', description: 'Second Cafe', logo: 'logo2.png', location: 'Los Angeles' },
      ];

      await db.Cafes.bulkCreate(cafes);

      // Make the GET request
      const res = await request(app).get('/api/cafes');

      // Check the response
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    
    });

  });

});

describe('Cafe Controller - getEmployeesByCafeId', () => {

  beforeEach(async () => {
    // Clear existing records from the Cafes and Employees tables before each test
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.Cafes.destroy({ where: {}, truncate: true });
    await db.Employee.destroy({ where: {}, truncate: true, cascade: true });
  });

  it('should return employees if cafe exists and has employees', async () => {
    // Create a cafe
    const cafe = await db.Cafes.create({
      id: uuidv4(), // Generate a unique ID for the cafe
      name: 'Cafe with Employees',
      description: 'A cafe with employees.',
      logo: 'employees_logo.png',
      location: 'Busy City',
    });

    // Add employees associated with the cafe using 'cafe_Id'
    const employee1 = await db.Employee.create({
      id: uuidv4(),
      name: 'Employee One',
      email_address: 'employee1@test.com',
      cafe_Id: cafe.id, 
      gender: "Male",
      phone_number: "91234567",
      startDate: new Date(),
      days_worked: 5,
    });

    const employee2 = await db.Employee.create({
      id: uuidv4(),
      name: 'Employee Two',
      email_address: 'employee2@test.com',
      cafe_Id: cafe.id, 
      gender: "Female",
      phone_number: "91234564",
      startDate: new Date(),
      days_worked: 10,
    });

    // Send a GET request to retrieve employees by cafe ID
    const res = await request(app).get(`/api/cafes/${cafe.id}/employees`);
    expect(res.status).to.equal(200); 
    expect(res.body[0].name).to.equal('Employee Two'); 
    expect(res.body[1].name).to.equal('Employee One');
  });
});



describe('POST /api/cafes', () => {

  beforeEach(async () => {
    // Clear the Cafes table before each test
    await db.Cafes.destroy({ where: {}, truncate: true });
  });

  it('should create a new cafe and return it', async () => {
    //Prepare the cafe data to be sent
    const cafeData = {
      name: 'New Cafe',
      description: 'A lovely cafe.',
      logo: 'new_cafe_logo.png',
      location: 'Sunnyvale',
    };

    // Make the POST request to create a new cafe
    const res = await request(app).post('/api/cafe').send(cafeData);

    //Check the response status and the created cafe data
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id'); 
    expect(res.body).to.have.property('name', cafeData.name);
    expect(res.body).to.have.property('description', cafeData.description);
    expect(res.body).to.have.property('logo', cafeData.logo);
    expect(res.body).to.have.property('location', cafeData.location);
  });

  it('should return 400 if validation fails', async () => {
    //Make the POST request with invalid data (missing required fields)
    const res = await request(app).post('/api/cafe').send({});

    // Check the response status and error message
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('errors').that.is.an('array').that.is.not.empty;
  });
});

describe('PUT /api/cafe/:id', () => {
  let cafeId;

  before(async () => {
    // Create a cafe to update later
    const cafe = await db.Cafes.create({
      id: uuidv4(),
      name: 'Original Cafe',
      description: 'Original description',
      logo: 'original_logo.png',
      location: 'Original Location',
    });
    cafeId = cafe.id;
  });

  it('should update the cafe and return the updated cafe', async () => {
    const updatedCafeData = {
      name: 'Updated Cafe',
      description: 'Updated description',
      logo: 'updated_logo.png',
      location: 'Updated Location',
    };

    const res = await request(app)
      .put(`/api/cafe/${cafeId}`)
      .send(updatedCafeData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', updatedCafeData.name);
    expect(res.body).to.have.property('description', updatedCafeData.description);
    expect(res.body).to.have.property('logo', updatedCafeData.logo);
    expect(res.body).to.have.property('location', updatedCafeData.location);
  });

  it('should return 404 if cafe does not exist', async () => {
    const nonExistentId = uuidv4();

    const updatedCafeData = {
      name: 'Non-existent Cafe',
      description: 'This should not work',
      logo: 'nonexistent_logo.png',
      location: 'Nowhere',
    };

    const res = await request(app)
      .put(`/api/cafe/${nonExistentId}`)
      .send(updatedCafeData);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Cafe not found.');
  });

  it('should return 400 if validation fails', async () => {
    const invalidCafeData = {
      // Missing required fields for validation
      name: '',
      description: 'This cafe has no name',
      logo: 'invalid_logo.png',
      location: 'Somewhere',
    };

    const res = await request(app)
      .put(`/api/cafe/${cafeId}`)
      .send(invalidCafeData);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('errors');
    expect(res.body.errors).to.be.an('array').that.is.not.empty;
  });
});

describe('DELETE /api/cafe/:id', () => {
  let cafeId;

  before(async () => {
    // Create a cafe and some employees for testing
    const cafe = await db.Cafes.create({
      id: uuidv4(),
      name: 'Cafe to Delete',
      description: 'This cafe will be deleted.',
      logo: 'delete_logo.png',
      location: 'Location to Delete',
    });

    cafeId = cafe.id;

    // Create some employees associated with the cafe
    await db.Employee.bulkCreate([
      {
        id: uuidv4(),
        name: 'Employee One',
        email_address: 'employee1@test.com',
        cafeId: cafeId,
        gender: "Male",
        phone_number: "91234567",
        startDate: new Date(),
        days_worked: 5,
      },
      {
        id: uuidv4(),
        name: 'Employee Two',
        email_address: 'employee2@test.com',
        cafeId: cafeId,
        gender: "Male",
        phone_number: "91234567",
        startDate: new Date(),
        days_worked: 10,
      },
    ]);
  });

  it('should delete the cafe and associated employees', async () => {
    const res = await request(app).delete(`/api/cafe/${cafeId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Cafe and associated employees deleted successfully.');

    // Verify that the cafe has been deleted
    const deletedCafe = await db.Cafes.findByPk(cafeId);
    expect(deletedCafe).to.be.null; 

    // Verify that employees have been deleted
    const employees = await db.Employee.findAll({ where: { cafeId } });
    expect(employees).to.be.an('array').that.is.empty;
  });

  it('should return 404 if cafe does not exist', async () => {
    const nonExistentId = uuidv4();

    const res = await request(app).delete(`/api/cafe/${nonExistentId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Cafe not found.');
  });
});


