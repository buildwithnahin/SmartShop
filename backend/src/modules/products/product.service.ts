import { prisma } from '../../server';
import { Prisma } from '@prisma/client';

export const getProducts = async (page: number = 1, limit: number = 20, search?: string) => {
  const skip = (page - 1) * limit;
  
  const where: Prisma.ProductWhereInput = search
    ? { name: { contains: search, mode: 'insensitive' } }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  const enhancedProducts = products.map(p => ({
    ...p,
    isLowStock: p.stockQuantity <= p.lowStockThreshold
  }));

  return {
    items: enhancedProducts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };
  
  return {
    ...product,
    isLowStock: product.stockQuantity <= product.lowStockThreshold
  };
};

export const createProduct = async (data: any) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id: string, data: any) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };

  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { statusCode: 404, message: 'Product not found' };

  await prisma.product.delete({ where: { id } });
  return { message: 'Product deleted successfully' };
};
