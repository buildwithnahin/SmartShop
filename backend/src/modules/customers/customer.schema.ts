import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Customer name requires at least 2 characters'),
    phone: z.string().optional().nullable(),
    // Note: totalPurchase is explicitly omitted here as it should only update via Sales natively
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Customer name requires at least 2 characters').optional(),
    phone: z.string().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid customer ID format'),
  })
});
