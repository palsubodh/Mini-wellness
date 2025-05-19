import { Request, Response } from 'express';
import Slot from '../models/slotModel';
import Booking from '../models/bookModel';
import User from '../models/userModel';
import { ApiResponse, ApiErrorResponse } from '../utills/apiResponse';
import { sendEmail } from '../utills/email';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: string };
    }
  }
}
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const slots = await Slot.find({ isBooked: false });
    const response = new ApiResponse(200, slots, 'Available slots fetched successfully');
     res.status(response.status_code).json(response);
     return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to fetch slots');
     res.status(errorResponse.status_code).json(errorResponse);
     return
  }
};
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.body;

    if (!slotId ) {
       res.status(400).json(new ApiErrorResponse(400, null, 'Slot ID is required'));
       return;
    }
    if (req.user?.role !== 'Member') {
       res.status(401).json(new ApiErrorResponse(401, null, 'Only members can book slots'));
       return;
    }
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
       res.status(400).json(new ApiErrorResponse(400, null, 'Slot not available'));
       return
    }

    const user = await User.findById(req?.user?.id);
    if (!user) {
       res.status(404).json(new ApiErrorResponse(404, null, 'User not found'));
       return
    }

    if (user.wallet < 200) {
       res.status(400).json(new ApiErrorResponse(400, null, 'Insufficient balance'));
       return;
    }

    user.wallet -= 200;
    await user.save();

    slot.isBooked = true;
    await slot.save();

    const booking = new Booking({
      memberId: user._id,
      slotId,
    });
    await booking.save();

    // Send confirmation email
     const emailResponse = await sendEmail({
        to: user.email,
        subject: 'Booking Confirmed',
        html: `<p>Your booking is confirmed for slot ID: ${slotId}.</p>`,
      })
    if (!emailResponse.success) {
       res.status(500).json(new ApiErrorResponse(500, emailResponse.error, 'Failed to send email'));
       return
    }
     res
      .status(200)
      .json(new ApiResponse(200, { bookingId: booking._id }, 'Booking confirmed'));
      return
  } catch (error: any) {
     res
      .status(500)
      .json(new ApiErrorResponse(500, error.message, 'Failed to book slot'));
      return
  }
};

export const getTrainerBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ trainerId: req?.user?.id });
    const response = new ApiResponse(200, bookings, 'Bookings fetched successfully');
     res.status(response.status_code).json(response);
     return
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, 'Failed to fetch bookings');
     res.status(errorResponse.status_code).json(errorResponse);
     return
  }
};
