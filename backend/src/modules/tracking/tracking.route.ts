import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { trackingController } from './tracking.controller';

const router = Router();

router.post('/update', authMiddleware, roleGuard.seller, trackingController.update);
router.get('/:orderId', authMiddleware, trackingController.get);

export default router;
