import { Router } from 'express';

const EmployeeRoutes = new Router();

import { createEmployee, updateEmployee, deleteEmployee, validateEmployee } from '../controllers/employeeController.js';

EmployeeRoutes.post('/employee', validateEmployee, createEmployee);
EmployeeRoutes.put('/employee/:id', validateEmployee, updateEmployee);
EmployeeRoutes.delete('/employee/:id', deleteEmployee);

export default EmployeeRoutes;