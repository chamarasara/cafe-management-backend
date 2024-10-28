import { Router } from 'express';
import logger from '../utils/logger.js';

const CafeRoutes = new Router();

import { 
  createCafe, 
  getAllCafes, 
  deleteCafe, 
  updateCafe, 
  validateCafe, 
  getEmployeesByCafeId 
} from '../controllers/cafeController.js';

// Middleware for logging requests
CafeRoutes.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, { 
    body: req.body, 
    query: req.query, 
    params: req.params 
  });
  next();
});

CafeRoutes.post('/cafe', validateCafe, async (req, res) => {
  try {
    await createCafe(req, res);
    logger.info('Cafe created successfully');
  } catch (error) {
    logger.error('Error creating cafe', { error: error.message });
  }
});

CafeRoutes.get('/cafes', async (req, res) => {
  try {
    await getAllCafes(req, res);
    logger.info('All cafes retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving cafes', { error: error.message });
  }
});

CafeRoutes.delete('/cafe/:id', async (req, res) => {
  try {
    await deleteCafe(req, res);
    logger.info(`Cafe with ID ${req.params.id} deleted successfully`);
  } catch (error) {
    logger.error('Error deleting cafe', { error: error.message });
  }
});

CafeRoutes.put('/cafe/:id', validateCafe, async (req, res) => {
  try {
    await updateCafe(req, res);
    logger.info(`Cafe with ID ${req.params.id} updated successfully`);
  } catch (error) {
    logger.error('Error updating cafe', { error: error.message });
  }
});

CafeRoutes.get('/cafes/:cafeId/employees', async (req, res) => {
  try {
    await getEmployeesByCafeId(req, res);
    logger.info(`Employees for cafe with ID ${req.params.cafeId} retrieved successfully`);
  } catch (error) {
    logger.error('Error retrieving employees by cafe ID', { error: error.message });
  }
});

export default CafeRoutes;
