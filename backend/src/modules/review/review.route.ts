import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { reviewController } from './review.controller';
import { reviewSchema } from './review.validation';

const router = Router();

router.get('/', reviewController.findAll);
router.get('/:targetId', reviewController.findByTarget);
router.post('/', authMiddleware, roleGuard.user, validateRequest(reviewSchema), reviewController.create);
router.delete('/:id', authMiddleware, reviewController.remove);

export default router;
