import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be greater than 0'),
    stockQuantity: z.number().int().nonnegative('Stock cannot be negative').default(0),
    lowStockThreshold: z.number().int().nonnegative('Threshold cannot be negative').default(5),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    stockQuantity: z.number().int().nonnegative('Stock cannot be negative').optional(),
    lowStockThreshold: z.number().int().nonnegative('Threshold cannot be negative').optional(),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  }),
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  })
});
