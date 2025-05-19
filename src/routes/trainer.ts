import express from 'express';
import { addSlot, getAllTrainers, getSlots } from '../controllers/trainerController';
const router = express.Router();

router.post('/slot', addSlot);
router.get('/trainers', getAllTrainers);
router.get('/slot/:trainerId', getSlots);

export default router;