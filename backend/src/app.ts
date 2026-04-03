import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler, notFoundHandler } from './middlewares/error';
import { sendSuccess } from './utils/response';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import customerRoutes from './modules/customers/customer.routes';
import saleRoutes from './modules/sales/sale.routes';
import reportRoutes from './modules/reports/report.routes';

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/api/v1/health', (req, res) => {
  sendSuccess(res, 200, 'Server is healthy', { timestamp: new Date().toISOString() });
});

// App Routes will be mounted here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1/reports', reportRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
