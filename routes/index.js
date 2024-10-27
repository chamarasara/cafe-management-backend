import express from 'express';
import cafeRoutes from './cafeRoutes.js';
import employeeRoutes from './employeeRoutes.js';

const router = express.Router();

router.use('/', cafeRoutes);
router.use('/', employeeRoutes);

export default router;
