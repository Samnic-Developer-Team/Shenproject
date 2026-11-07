import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard, authorizeRoles } from '../../middleware/role.middleware';
import { Roles } from '../../constants/roles';
import { validateRequest } from '../../middleware/validate.middleware';
import { productController } from './product.controller';
import { productSchema } from './product.validation';

const router = Router();

router.get('/', productController.findAll);
router.post('/', authMiddleware, roleGuard.seller, validateRequest(productSchema), productController.create);
router.patch('/:id', authMiddleware, roleGuard.seller, productController.update);
router.delete('/:id', authMiddleware, authorizeRoles(Roles.SELLER, Roles.ADMIN), productController.remove);

export default router;
