import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { addressController } from './address.controller.js';
import { addressCreateSchema, addressRemoveSchema, addressUpdateSchema } from './address.validator.js';

export const addressRouter = Router();

addressRouter.use(requireAuth);
addressRouter.get('/', addressController.list);
addressRouter.post('/', validate(addressCreateSchema), addressController.create);
addressRouter.put('/:id', validate(addressUpdateSchema), addressController.update);
addressRouter.delete('/:id', validate(addressRemoveSchema), addressController.remove);
