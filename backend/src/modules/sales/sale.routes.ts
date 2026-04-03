import { Router } from 'express';
import { authenticate, authorizeRole } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createSaleSchema } from './sale.schema';
import * as SaleController from './sale.controller';

const router = Router();

// Only authenticated staff and admins can perform sales and view history
router.use(authenticate);

router.post('/', validate(createSaleSchema), SaleController.createSale);
router.get('/', SaleController.getSalesHistory);
router.get('/:id', SaleController.getSaleDetails);

export default router;
