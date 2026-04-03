import { Request, Response } from 'express';
import * as productService from './product.service';
import { sendSuccess } from '../../utils/response';
import { catchAsync } from '../../utils/catchAsync';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;

  const result = await productService.getProducts(page, limit, search);
  sendSuccess(res, 200, 'Products retrieved successfully', result);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);
  sendSuccess(res, 200, 'Product retrieved successfully', product);
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendSuccess(res, 201, 'Product created successfully', product);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  sendSuccess(res, 200, 'Product updated successfully', product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id as string);
  sendSuccess(res, 200, 'Product deleted successfully');
});
