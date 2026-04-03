import { prisma } from '../../server';
import { Prisma } from '@prisma/client';

export const getCustomers = async (page: number = 1, limit: number = 20, search?: string) => {
  const skip = (page - 1) * limit;
  
  const where: Prisma.CustomerWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    items: customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      sales: {
        orderBy: { createdAt: 'desc' },
        take: 5 // Provide top 5 recent sales as context
      }
    }
  });

  if (!customer) throw { statusCode: 404, message: 'Customer not found' };
  
  return customer;
};

export const createCustomer = async (data: any) => {
  return prisma.customer.create({ data });
};

export const updateCustomer = async (id: string, data: any) => {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw { statusCode: 404, message: 'Customer not found' };

  return prisma.customer.update({
    where: { id },
    data,
  });
};
