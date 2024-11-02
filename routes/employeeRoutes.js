import { Router } from 'express';
import logger from '../utils/logger.js'; 

import { 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  getAllEmployees,
  validateEmployee 
} from '../controllers/employeeController.js';

const EmployeeRoutes = new Router();

// Middleware for logging requests
EmployeeRoutes.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, {
        body: req.body,
        query: req.query,
        params: req.params,
    });
    next();
});

// Route for creating an employee
EmployeeRoutes.post('/employee', validateEmployee, async (req, res) => {
    try {
        await createEmployee(req, res);
        logger.info('Employee created successfully');
    } catch (error) {
        logger.error('Error creating employee', { error: error.message });
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
});

// Route for updating an employee
EmployeeRoutes.put('/employee/:id', validateEmployee, async (req, res) => {
    try {
        await updateEmployee(req, res);
        logger.info(`Employee with ID ${req.params.id} updated successfully`);
    } catch (error) {
        logger.error('Error updating employee', { error: error.message });
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

// Route for deleting an employee
EmployeeRoutes.delete('/employee/:id', async (req, res) => {
    try {
        await deleteEmployee(req, res);
        logger.info(`Employee with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        logger.error('Error deleting employee', { error: error.message });
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});

// Route for fetching all employees
EmployeeRoutes.get('/employees', async (req, res) => {
    try {
        await getAllEmployees(req, res);
        logger.info('Fetched all employees successfully');
    } catch (error) {
        logger.error('Error fetching all employees', { error: error.message });
        res.status(500).json({ message: 'Error fetching all employees', error: error.message });
    }
});

export default EmployeeRoutes;
