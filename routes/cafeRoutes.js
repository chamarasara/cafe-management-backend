import { Router } from 'express';

const CafeRoutes = new Router();

import { createCafe, getAllCafes, deleteCafe, updateCafe, validateCafe, getEmployeesByCafeId } from '../controllers/cafeController.js';

CafeRoutes.post('/cafe', validateCafe,createCafe);
CafeRoutes.get('/cafes', getAllCafes);
CafeRoutes.delete('/cafe/:id', deleteCafe);
CafeRoutes.put('/cafe/:id', validateCafe, updateCafe);
CafeRoutes.get('/cafes/:cafeId/employees', getEmployeesByCafeId);

export default CafeRoutes;