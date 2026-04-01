import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartshop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@smartshop.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Staff User
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@smartshop.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'staff@smartshop.com',
      password: staffPassword,
      role: 'STAFF',
    },
  });
  console.log('Staff user created:', staff.email);

  // 3. Create Sample Products
  const products = await Promise.all([
    prisma.product.create({
      data: { name: 'Milk 1L', price: 2.5, stockQuantity: 50, lowStockThreshold: 10 },
    }),
    prisma.product.create({
      data: { name: 'Bread', price: 1.5, stockQuantity: 30, lowStockThreshold: 5 },
    }),
    prisma.product.create({
      data: { name: 'Eggs 12-pack', price: 3.0, stockQuantity: 20, lowStockThreshold: 5 },
    }),
    prisma.product.create({
      data: { name: 'Coffee Beans', price: 8.0, stockQuantity: 15, lowStockThreshold: 5 },
    }),
  ]);
  console.log(`Created ${products.length} sample products.`);

  // 4. Create Sample Customer
  const customer = await prisma.customer.create({
    data: {
      name: 'John Doe',
      phone: '+1234567890',
      totalPurchase: 0,
    },
  });
  console.log('Sample customer created:', customer.name);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
