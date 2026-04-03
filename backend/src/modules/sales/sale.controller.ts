import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as SaleService from './sale.service';

export const createSale = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId; // Assumes authMiddleware sets req.user
  const payload = req.body;

  const result = await SaleService.createSaleProcess(userId, payload);
  sendSuccess(res, 201, 'Sale created successfully', result);
});

export const getSalesHistory = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

  const result = await SaleService.getSalesHistory(page, limit, startDate, endDate);
  sendSuccess(res, 200, 'Sales history retrieved successfully', result);
});

export const getSaleDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.getSaleDetails(req.params.id as string as string);
  sendSuccess(res, 200, 'Sale details retrieved successfully', result);
});
