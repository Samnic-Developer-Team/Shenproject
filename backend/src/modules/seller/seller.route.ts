import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { sellerController } from './seller.controller';
import { createSellerSchema } from './seller.validation';

const router = Router();

// Admin routes
router.post('/', authMiddleware, roleGuard.admin, validateRequest(createSellerSchema), sellerController.create);
router.patch('/:id/approve', authMiddleware, roleGuard.admin, sellerController.approve);

// Seller shop profile routes
router.get('/me', authMiddleware, roleGuard.seller, sellerController.getMe);
router.post('/register-shop', authMiddleware, roleGuard.seller, validateRequest(createSellerSchema), sellerController.registerShop);
router.put('/me', authMiddleware, roleGuard.seller, validateRequest(createSellerSchema), sellerController.updateMe);

export default router;
