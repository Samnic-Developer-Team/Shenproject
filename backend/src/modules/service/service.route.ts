import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard, authorizeRoles } from '../../middleware/role.middleware';
import { Roles } from '../../constants/roles';
import { validateRequest } from '../../middleware/validate.middleware';
import { serviceController } from './service.controller';
import { serviceSchema } from './service.validation';

const router = Router();

router.get('/', serviceController.findAll);
router.post('/', authMiddleware, roleGuard.seller, validateRequest(serviceSchema), serviceController.create);
router.patch('/:id', authMiddleware, roleGuard.seller, serviceController.update);
router.delete('/:id', authMiddleware, authorizeRoles(Roles.SELLER, Roles.ADMIN), serviceController.remove);

export default router;
