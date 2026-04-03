import { prisma } from '../../server';
import { ApiError } from '../../utils/ApiError';

export const createSaleProcess = async (
  userId: string,
  payload: { customerId?: string; items: { productId: string; quantity: number }[] }
) => {
  return await prisma.$transaction(async (tx: any) => {
    let totalAmount = 0;
    const saleItemsData = [];

    // Verify stock and calculate total amount
    for (const item of payload.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new ApiError(404, `Product with ID ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      // Deduct stock
      await tx.product.update({
        where: { id: product.id },
        data: { stockQuantity: { decrement: item.quantity } }
      });
    }

    // Create the Sale record
    const sale = await tx.sale.create({
      data: {
        totalAmount,
        userId,
        customerId: payload.customerId,
        saleItems: {
          create: saleItemsData
        }
      },
      include: {
        saleItems: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        },
        customer: {
          select: { id: true, name: true, phone: true }
        }
      }
    });

    // If customer exists, update total purchase
    if (payload.customerId) {
      await tx.customer.update({
        where: { id: payload.customerId },
        data: { totalPurchase: { increment: totalAmount } }
      });
    }

    return sale;
  });
};

export const getSalesHistory = async (page = 1, limit = 10, startDate?: Date, endDate?: Date) => {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const [data, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true, phone: true }
        },
        user: {
          select: { name: true }
        }
      }
    }),
    prisma.sale.count({ where })
  ]);

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getSaleDetails = async (id: string) => {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      saleItems: {
        include: {
          product: {
            select: { name: true, price: true }
          }
        }
      },
      customer: {
        select: { name: true, phone: true }
      },
      user: {
        select: { name: true }
      }
    }
  });

  if (!sale) {
    throw new ApiError(404, 'Sale not found');
  }

  return sale;
};
