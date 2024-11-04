import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

describe('Cafe Controller', () => {
  beforeEach(async () => {
    await db.Cafes.destroy({ where: {}, truncate: true });
  });

  describe('GET /cafes', () => {
    it('should retrieve all cafes when no location is provided', async () => {
      //Create some cafes
      const cafes = [
        { id: uuidv4(), name: 'Cafe One', description: 'First Cafe', logo: 'logo1.png', location: 'New York' },
        { id: uuidv4(), name: 'Cafe Two', description: 'Second Cafe', logo: 'logo2.png', location: 'Los Angeles' },
      ];

      await db.Cafes.bulkCreate(cafes);

      // Make the GET request
      const res = await request(app).get('/api/cafes');

      //  Check the response
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);

      // Sort the response body by name for comparison
      const sortedResponse = res.body.sort((a, b) => a.name.localeCompare(b.name));

      expect(sortedResponse[0]).to.have.property('name').that.equals('Cafe One');
      expect(sortedResponse[1]).to.have.property('name').that.equals('Cafe Two');
    });


    it('should retrieve cafes filtered by location', async () => {
      //  Create some cafes
      const cafes = [
        { id: uuidv4(), name: 'Cafe Three', description: 'Third Cafe', logo: 'logo3.png', location: 'New York' },
        { id: uuidv4(), name: 'Cafe Four', description: 'Fourth Cafe', logo: 'logo4.png', location: 'Los Angeles' },
      ];

      await db.Cafes.bulkCreate(cafes);

      // Make the GET request with a location query
      const res = await request(app).get('/api/cafes?location=New York');

      //  Check the response
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1); // Expecting 1 cafe for New York
      expect(res.body[0]).to.have.property('name').that.equals('Cafe Three');
    });

    it('should return an empty array if no cafes match the location', async () => {
      // Make the GET request with a non-matching location
      const res = await request(app).get('/api/cafes?location=NonExistingLocation');

      //  Check the response
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty; // Expecting an empty array
    });
  });
});

describe('Cafe Controller - getEmployeesByCafeId', () => {

  beforeEach(async () => {
    await db.Cafes.destroy({ where: {}, truncate: true });
    await db.Employee.destroy({ where: {}, truncate: true });
  });

  it('should return employees if cafe exists and has employees', async () => {
    const cafe = await db.Cafes.create({
      id: uuidv4(),
      name: 'Cafe with Employees',
      description: 'A cafe with employees.',
      logo: 'employees_logo.png',
      location: 'Busy City',
    });

    // Add employees associated with the cafe
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
      gender: "Female",
      phone_number: "91234564",
      startDate: new Date(),
      days_worked: 10,
    });

    const res = await request(app).get(`/api/cafes/${cafe.id}/employees`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.has.lengthOf(2);
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
    expect(res.body).to.have.property('id'); // Assuming `id` is auto-generated
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
    expect(deletedCafe).to.be.null; // Cafe should be null

    // Verify that employees have been deleted
    const employees = await db.Employee.findAll({ where: { cafeId } });
    expect(employees).to.be.an('array').that.is.empty; // Employees should be empty
  });

  it('should return 404 if cafe does not exist', async () => {
    const nonExistentId = uuidv4();

    const res = await request(app).delete(`/api/cafe/${nonExistentId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Cafe not found.');
  });
});


