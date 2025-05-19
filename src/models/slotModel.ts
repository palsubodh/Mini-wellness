import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  time: String,
  isBooked: { type: Boolean, default: false }
});

export default mongoose.model('Slot', slotSchema);
