import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { addressController } from './address.controller.js';

export const addressRouter = Router();

addressRouter.use(requireAuth);
addressRouter.get('/', addressController.list);
addressRouter.post('/', addressController.create);
addressRouter.put('/:id', addressController.update);
addressRouter.delete('/:id', addressController.remove);
