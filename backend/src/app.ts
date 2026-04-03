import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler, notFoundHandler } from './middlewares/error';
import { sendSuccess } from './utils/response';
import authRoutes from './modules/auth/auth.routes';

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

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
