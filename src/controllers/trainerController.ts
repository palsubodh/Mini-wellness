import { Request, Response } from 'express';
import Slot from '../models/slotModel';
import { ApiResponse, ApiErrorResponse } from '../utills/apiResponse';
import userModel from '../models/userModel';

export const addSlot = async (req: Request, res: Response) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      const errorResponse = new ApiErrorResponse(400, null, 'Date and time are required');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    if (!req.user?.id) {
      const errorResponse = new ApiErrorResponse(401, null, 'Unauthorized');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const slot = new Slot({
      trainerId: req.user.id,
      date,
      time,
    });

    await slot.save();

    const successResponse = new ApiResponse(201, { slotId: slot._id }, 'Slot added successfully');
    res.status(successResponse.status_code).json(successResponse);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to add slot');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await userModel.find({ role: 'Trainer' }).select('-password -wallet -role');
    const response = new ApiResponse(200, trainers, 'Available trainers fetched successfully');
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to fetch trainers');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const getSlots = async (req: Request, res: Response) => {
  try {
    const trainerId = req.params.trainerId;

    if (!trainerId) {
      const errorResponse = new ApiErrorResponse(400, null, 'Trainer ID is required');
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const slots = await Slot.find({ trainerId });

    const successResponse = new ApiResponse(200, slots, 'Slots retrieved successfully');
    res.status(successResponse.status_code).json(successResponse);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to fetch slots');
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};
