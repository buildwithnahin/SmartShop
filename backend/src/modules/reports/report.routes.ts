import { Router } from 'express';
import { authenticate, authorizeRole } from '../../middlewares/auth';
import * as ReportController from './report.controller';

const router = Router();

// Only Admins can view reports
router.use(authenticate);
router.use(authorizeRole(['ADMIN']));

router.get('/dashboard', ReportController.getDashboardSummary);
router.get('/low-stock', ReportController.getLowStockProducts);

export default router;
