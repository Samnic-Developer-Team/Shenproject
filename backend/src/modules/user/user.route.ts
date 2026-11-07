import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { userController } from './user.controller';
import { updateUserSchema, addressSchema, wishlistParamSchema } from './user.validation';

const router = Router();

router.get('/me', authMiddleware, userController.me);
router.patch('/me', authMiddleware, validateRequest(updateUserSchema), userController.update);
router.post('/address', authMiddleware, validateRequest(addressSchema), userController.addAddress);
router.post('/wishlist/:productId', authMiddleware, validateRequest(wishlistParamSchema), userController.toggleWishlist);
router.get('/orders', authMiddleware, userController.orders);
router.get('/bookings', authMiddleware, userController.bookings);

// Admin user management routes
router.get('/', authMiddleware, roleGuard.admin, userController.listAllUsers);
router.patch('/:id/toggle-active', authMiddleware, roleGuard.admin, userController.toggleActive);

export default router;
