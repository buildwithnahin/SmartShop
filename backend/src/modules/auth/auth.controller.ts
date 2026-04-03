import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';
import { catchAsync } from '../../utils/catchAsync';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  sendSuccess(res, 201, 'User registered successfully', user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, 200, 'Login successful', result);
});
