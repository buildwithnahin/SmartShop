import { prisma } from '../../server';

export const getDashboardSummary = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  // Aggregate today's sales
  const salesToday = await prisma.sale.aggregate({
    where: { createdAt: { gte: startOfDay } },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  // Aggregate this month's sales
  const salesMonth = await prisma.sale.aggregate({
    where: { createdAt: { gte: startOfMonth } },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  // Count low stock products (treating <= 5 as low stock for dashboard quick stats)
  const lowStockCount = await prisma.product.count({
    where: { stockQuantity: { lte: 5 } },
  });

  return {
    today: {
      revenue: salesToday._sum.totalAmount || 0,
      salesCount: salesToday._count.id || 0,
    },
    thisMonth: {
      revenue: salesMonth._sum.totalAmount || 0,
      salesCount: salesMonth._count.id || 0,
    },
    lowStockAlerts: lowStockCount,
  };
};

export const getLowStockProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where: { stockQuantity: { lte: 5 } },
      skip,
      take: limit,
      orderBy: { stockQuantity: 'asc' },
    }),
    prisma.product.count({
      where: { stockQuantity: { lte: 5 } },
    }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};
