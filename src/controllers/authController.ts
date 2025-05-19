import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { ApiResponse, ApiErrorResponse } from '../utills/apiResponse';
import { loginSchema, registerSchema, topUpSchema } from '../utills/validations';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: string };
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errorResponse = new ApiErrorResponse(400, validation.error.format(), 'Validation failed');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const errorResponse = new ApiErrorResponse(400, null, 'Email already registered');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const response = new ApiResponse(201, null, 'Registered successfully');
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Registration failed');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const errorResponse = new ApiErrorResponse(400, validation.error.format(), 'Validation failed');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });
    const isValid = user?.password && await bcrypt.compare(password, user.password);

    if (!isValid) {
      const errorResponse = new ApiErrorResponse(400, null, 'Invalid credentials');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string);

    const response = new ApiResponse(200, { token }, 'Login successful');
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Login failed');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const topUp = async (req: Request, res: Response) => {
  try {
    const validation = topUpSchema.safeParse(req.body);
    if (!validation.success) {
      const errorResponse = new ApiErrorResponse(400, validation.error.format(), 'Validation failed');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    if (req.user?.role !== 'Member') {
      const errorResponse = new ApiErrorResponse(401, null, 'Only Members can top up their wallets');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const { amount } = validation.data;

    if (amount <= 0) {
      const errorResponse = new ApiErrorResponse(400, null, 'Amount must be greater than 0');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const user = await User.findById(req?.user?.id);

    if (!user) {
      const errorResponse = new ApiErrorResponse(404, null, 'User not found');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    user.wallet += amount;
    await user.save();

    const response = new ApiResponse(200, { wallet: user.wallet }, 'Top-up successful');
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Top-up failed');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};
