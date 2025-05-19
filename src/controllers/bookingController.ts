import { Request, Response } from "express";
import Slot from "../models/slotModel";
import Booking from "../models/bookModel";
import User from "../models/userModel";
import { ApiResponse, ApiErrorResponse } from "../utills/apiResponse";
import { sendEmail } from "../utills/email";

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
    const response = new ApiResponse(
      200,
      slots,
      "Available slots fetched successfully"
    );
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(
      500,
      error.message,
      "Failed to fetch slots"
    );
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      const errorResponse = new ApiErrorResponse(400, null, "Slot ID is required");
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    if (req.user?.role !== "Member") {
      const errorResponse = new ApiErrorResponse(401, null, "Only members can book slots");
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      const errorResponse = new ApiErrorResponse(400, null, "Slot not available");
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const user = await User.findById(req?.user?.id);
    if (!user) {
      const errorResponse = new ApiErrorResponse(404, null, "User not found");
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    if (user.wallet < 200) {
      const errorResponse = new ApiErrorResponse(400, null, "Insufficient balance");
      res.status(errorResponse.status_code).json(errorResponse);
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

    if (!user?.email) {
      throw new Error("User email is missing");
    }

    const emailResponse = await sendEmail({
      to: user.email,
      subject: "Booking Confirmed",
      html: `<p>Your booking is confirmed for slot ID: ${slotId}.</p>`,
    });

    if (!emailResponse.success) {
      const errorResponse = new ApiErrorResponse(500, emailResponse.error, "Failed to send email");
      res.status(errorResponse.status_code).json(errorResponse);
      return;
    }

    const successResponse = new ApiResponse(
      200,
      { bookingId: booking._id },
      "Booking confirmed"
    );
    res.status(successResponse.status_code).json(successResponse);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(500, error.message, "Failed to book slot");
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};

export const getTrainerBookings = async (req: Request, res: Response) => {

  try {
    console.log(" req?.user?.id", req?.user?.id);
    
    const bookings = await Booking.find({ memberId: req?.user?.id });
    const response = new ApiResponse(
      200,
      bookings,
      "Bookings fetched successfully"
    );
    res.status(response.status_code).json(response);
    return;
  } catch (error: any) {
    const errorResponse = new ApiErrorResponse(
      500,
      error.message,
      "Failed to fetch bookings"
    );
    res.status(errorResponse.status_code).json(errorResponse);
    return;
  }
};
