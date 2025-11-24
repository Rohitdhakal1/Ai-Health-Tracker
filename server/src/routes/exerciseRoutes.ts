import express from 'express';
import { addExercise, getExercises } from '../controllers/exerciseCantroller';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, addExercise)
    .get(protect, getExercises);

export default router;