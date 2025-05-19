import express from 'express';
import { register, login, topUp } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/topup', authenticate, topUp);

export default router;
