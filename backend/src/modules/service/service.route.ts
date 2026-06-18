import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { serviceController } from './service.controller';
import { serviceSchema } from './service.validation';

const router = Router();

router.get('/', serviceController.findAll);
router.post('/', authMiddleware, roleGuard.seller, validateRequest(serviceSchema), serviceController.create);
router.patch('/:id', authMiddleware, roleGuard.seller, serviceController.update);
router.delete('/:id', authMiddleware, roleGuard.seller, serviceController.remove);

export default router;
