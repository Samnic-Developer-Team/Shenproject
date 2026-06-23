import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { orderController } from './order.controller';
import { orderSchema } from './order.validation';

const router = Router();

router.get('/user', authMiddleware, roleGuard.user, orderController.getUserOrders);
router.get('/seller', authMiddleware, roleGuard.seller, orderController.getSellerOrders);
router.get('/', authMiddleware, roleGuard.admin, orderController.findAll);
router.post('/', authMiddleware, roleGuard.user, validateRequest(orderSchema), orderController.create);
router.get('/:id', authMiddleware, orderController.getById);
router.patch('/:id/status', authMiddleware, roleGuard.admin, orderController.updateStatus);
router.patch('/:id', authMiddleware, roleGuard.admin, orderController.update);

export default router;
