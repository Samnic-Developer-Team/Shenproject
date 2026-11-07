import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { adminController } from './admin.controller';

const router = Router();

router.get('/stats', authMiddleware, roleGuard.admin, adminController.getStats);
router.get('/', authMiddleware, roleGuard.admin, adminController.findAll);

export default router;

