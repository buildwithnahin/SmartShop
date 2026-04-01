import app from './app';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || 4000;
export const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
