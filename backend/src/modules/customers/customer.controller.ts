import { Request, Response } from 'express';
import * as customerService from './customer.service';
import { sendSuccess } from '../../utils/response';
import { catchAsync } from '../../utils/catchAsync';

export const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;

  const result = await customerService.getCustomers(page, limit, search);
  sendSuccess(res, 200, 'Customers retrieved successfully', result);
});

export const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id as string);
  sendSuccess(res, 200, 'Customer retrieved successfully', customer);
});

export const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  sendSuccess(res, 201, 'Customer created successfully', customer);
});

export const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(req.params.id as string, req.body);
  sendSuccess(res, 200, 'Customer updated successfully', customer);
});
