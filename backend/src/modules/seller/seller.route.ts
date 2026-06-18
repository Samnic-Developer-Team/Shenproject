import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { sellerController } from './seller.controller';
import { createSellerSchema } from './seller.validation';

const router = Router();

router.post('/', authMiddleware, roleGuard.admin, validateRequest(createSellerSchema), sellerController.create);
router.patch('/:id/approve', authMiddleware, roleGuard.admin, sellerController.approve);

export default router;
