import express from 'express';
import { getAvailableSlots, bookSlot, getTrainerBookings } from '../controllers/bookingController';
const router = express.Router();

router.get('/slots', getAvailableSlots);
router.post('/book', bookSlot);
router.get('/my-bookings', getTrainerBookings);

export default router;