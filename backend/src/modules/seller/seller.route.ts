import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { sellerController } from './seller.controller';
import { createSellerSchema } from './seller.validation';

const router = Router();

// Seller shop profile routes (Must be declared before /:id)
router.get('/me', authMiddleware, roleGuard.seller, sellerController.getMe);

// Public route — list all active sellers (for salons page)
router.get('/', sellerController.listAll);
router.get('/:id', sellerController.getById);

// Admin routes
router.get('/admin/all', authMiddleware, roleGuard.admin, sellerController.listAllAdmin);
router.patch('/:id/toggle-active', authMiddleware, roleGuard.admin, sellerController.toggleActive);
router.post('/admin', authMiddleware, roleGuard.admin, validateRequest(createSellerSchema), sellerController.create);
router.patch('/:id/approve', authMiddleware, roleGuard.admin, sellerController.approve);
router.put('/:id', authMiddleware, roleGuard.admin, sellerController.updateById);
router.post('/register-shop', authMiddleware, roleGuard.seller, validateRequest(createSellerSchema), sellerController.registerShop);
router.put('/me', authMiddleware, roleGuard.seller, validateRequest(createSellerSchema), sellerController.updateMe);

export default router;
