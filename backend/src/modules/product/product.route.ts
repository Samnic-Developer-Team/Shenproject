import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { productController } from './product.controller';
import { productSchema } from './product.validation';

const router = Router();

router.get('/', productController.findAll);
router.post('/', authMiddleware, roleGuard.seller, validateRequest(productSchema), productController.create);
router.patch('/:id', authMiddleware, roleGuard.seller, productController.update);
router.delete('/:id', authMiddleware, roleGuard.seller, productController.remove);

export default router;
