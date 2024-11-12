import db from '../models/index.js';
import { Op } from 'sequelize';
import { body, validationResult } from 'express-validator';

export const validateCafe = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  body('location').notEmpty().withMessage('Location is required.')
];

export const getAllCafes = async (req, res) => {
  try {
    const { location } = req.query;
    let cafes;
    // If a location is provided, filter cafes by location
    if (location) {
      cafes = await db.Cafes.findAll({
        where: {
          location: { [Op.like]: `%${location}%` }
        },
        include: [{ model: db.Employee, as: 'Employees' }],
        nest: true,
      });
    } else {
      // If no location, retrieve all cafes
      cafes = await db.Cafes.findAll({
        include: [{ model: db.Employee, as: 'Employees' }],
      });
    }

    // Map and sort cafes by employee count
    const formattedCafes = cafes.map(cafe => ({
      ...cafe.toJSON(),
      employeeCount: cafe.Employees.length,
    }));

    // Sort cafes by employee count in descending order
    const sortedCafes = formattedCafes.sort((a, b) => b.employeeCount - a.employeeCount);

    // If location was provided and no cafes were found, return an empty list
    if (location && sortedCafes.length === 0) {
      return res.json([]); 
    }

    // Return the sorted cafes
    res.json(sortedCafes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to retrieve cafes' });
  }
};


export const getEmployeesByCafeId = async (req, res) => {
  const { cafe_Id } = req.params;
  try {
    // Check if the cafe exists
    const cafeExists = await db.Cafes.findOne({ where: { id: cafe_Id } });

    if (!cafeExists) {
      return res.status(404).json({ error: 'Cafe not found.' });
    }

    // Find all employees associated with the cafe_Id
    const employees = await db.Employee.findAll({
      where: { cafe_Id },
      order: [['days_worked', 'DESC']]
    });

    // Return an empty array if no employees exist for the cafeId
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving employees.' });
  }
};



export const createCafe = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, logo, location } = req.body;

    const newCafe = await db.Cafes.create({
      name,
      description,
      logo,
      location,
    });

    const formattedResponse = {
      id: newCafe.id,
      name: newCafe.name,
      description: newCafe.description,
      logo: newCafe.logo || null,
      location: newCafe.location,
      createdAt: newCafe.createdAt,
      updatedAt: newCafe.updatedAt,
      Employee: [],
      employeeCount: 0
    };


    res.status(201).json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create cafe' });
  }
};

export const updateCafe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo, location } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cafe = await db.Cafes.findByPk(id);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found.' });
    }

    cafe.name = name;
    cafe.description = description;
    cafe.logo = logo;
    cafe.location = location;
    await cafe.save();

    res.status(200).json(cafe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cafe.' });
  }
};

export const deleteCafe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the cafe by id
    const cafe = await db.Cafes.findByPk(id);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found.' });
    }

    // Delete all employees associated with the cafe
    await db.Employee.destroy({ where: { cafe_Id: id } });

    // Delete the cafe 
    await cafe.destroy();

    return res.status(200).json({ message: 'Cafe and associated employees deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete cafe and associated employees.' });
  }
};
