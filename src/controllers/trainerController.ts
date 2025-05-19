import { Request, Response } from 'express';
import Slot from '../models/slotModel';
import { ApiResponse, ApiErrorResponse } from '../utills/apiResponse';
import userModel from '../models/userModel';



export const addSlot = async (req: Request, res: Response) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
       res.status(400).json(new ApiErrorResponse(400, null, 'Date and time are required'));
       return;
    }

    if (!req.user?.id) {
       res.status(401).json(new ApiErrorResponse(401, null, 'Unauthorized'));
       return;
    }

    const slot = new Slot({
      trainerId: req.user.id,
      date,
      time,
    });

    await slot.save();

     res
      .status(201)
      .json(new ApiResponse(201, { slotId: slot._id }, 'Slot added successfully'));
      return;
  } catch (error: any) {
     res
      .status(500)
      .json(new ApiErrorResponse(500, error.message, 'Failed to add slot'));
      return;
  }
};

export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await userModel.find({ role: 'Trainer' }).select('-password -wallet -role');
    const response = new ApiResponse(200, trainers, 'Available trainers fetched successfully');
     res.status(response.status_code).json(response);
  } catch (error: any) {
     const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to fetch trainers');
      res.status(errorResponse.status_code).json(errorResponse);
  }
}

export const getSlots = async (req: Request, res: Response) => {
  try {

    const trainerId = req.params.trainerId;
    const slots = await Slot.find({ trainerId });

     res
      .status(200)
      .json(new ApiResponse(200, slots, 'Slots retrieved successfully'));
      return;
  } catch (error: any) {
     res
      .status(500)
      .json(new ApiErrorResponse(500, error.message, 'Failed to fetch slots'));
      return
  }
};
