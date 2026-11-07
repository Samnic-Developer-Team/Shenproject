import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { locationController } from './location.controller';
import { createLocationSchema } from './location.validation';

const router = Router();

// Public route to list locations
router.get('/', locationController.list);

// Admin routes for location management
router.get('/shopowner-locations', authMiddleware, roleGuard.admin, locationController.listShopownerLocations);
router.post('/', authMiddleware, roleGuard.admin, validateRequest(createLocationSchema), locationController.create);
router.patch('/:id/toggle-active', authMiddleware, roleGuard.admin, locationController.toggleActive);
router.delete('/:id', authMiddleware, roleGuard.admin, locationController.delete);

export default router;
