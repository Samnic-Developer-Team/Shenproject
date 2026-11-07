import { Router } from 'express';
import adminRoutes from './admin.route';
import authRoutes from './auth.route';
import bookingRoutes from './booking.route';
import orderRoutes from './order.route';
import productRoutes from './product.route';
import reviewRoutes from './review.route';
import sellerRoutes from './seller.route';
import serviceRoutes from './service.route';
import trackingRoutes from './tracking.route';
import userRoutes from './user.route';
import locationRoutes from './location.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sellers', sellerRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/tracking', trackingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admins', adminRoutes);
router.use('/locations', locationRoutes);

export default router;
