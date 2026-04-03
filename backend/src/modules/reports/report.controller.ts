import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as ReportService from './report.service';

export const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.getDashboardSummary();
  sendSuccess(res, 200, 'Dashboard summary retrieved successfully', result);
});

export const getLowStockProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const result = await ReportService.getLowStockProducts(page, limit);
  sendSuccess(res, 200, 'Low stock products retrieved successfully', result);
});
