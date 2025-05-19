import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }
})

export default mongoose.model('Booking', bookingSchema);