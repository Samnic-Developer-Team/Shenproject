import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { bookingController } from './booking.controller';
import { bookingSchema } from './booking.validation';

const router = Router();

router.get('/', authMiddleware, roleGuard.admin, bookingController.findAll);
router.post('/', authMiddleware, roleGuard.user, validateRequest(bookingSchema), bookingController.create);
router.patch('/:id', authMiddleware, bookingController.update);

router.get('/user', authMiddleware, roleGuard.user, bookingController.getUserBookings);
router.get('/seller', authMiddleware, roleGuard.seller, bookingController.getSellerBookings);

export default router;
