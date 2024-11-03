import db from '../models/index.js';
import { body, validationResult } from 'express-validator';

export const validateEmployee = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email_address').isEmail().withMessage('Valid email address is required.'),
    body('phone_number').matches(/^[89]\d{7}$/).withMessage('Phone number must start with 8 or 9 and be 8 digits long.'),
    body('gender').notEmpty().withMessage('Gender is required.'),
    body('cafeId').notEmpty().withMessage('Cafe ID is required.')
];

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await db.Employee.findAll();

        return res.status(200).json( employees );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while retrieving employees.' });
    }
};

export const createEmployee = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  
    try {
        const { name, email_address, phone_number, gender, cafeId } = req.body;

        // Check if an employee with the same email exists for any cafe
        const existingEmployee = await db.Employee.findOne({ where: { email_address } });
        if (existingEmployee) {
            return res.status(400).json({ message: 'An employee with this email already exists in another cafe.' });
        }

        // Create the employee 
        const employee = await db.Employee.create({ 
            name, 
            email_address, 
            phone_number, 
            gender, 
            cafeId, 
            startDate: new Date() 
        });

        return res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};



export const updateEmployee = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email_address, phone_number, gender, cafeId } = req.body;

    try {
        // Find the employee by id
        const employee = await db.Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        // Update employee details
        await db.Employee.update(
            {
                name,
                email_address,
                phone_number,
                gender,
                cafeId
            },
            { where: { id: id } }
        );

        // Retrieve the updated employee
        const updatedEmployee = await db.Employee.findByPk(id);

        return res.status(200).json({ message: 'Employee updated successfully.', employee: updatedEmployee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating the employee.' });
    }
};


export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the employee by id
        const employee = await db.Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        // Delete the employee
        await db.Employee.destroy({ where: { id: id } });

        return res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while deleting the employee.' });
    }
};


