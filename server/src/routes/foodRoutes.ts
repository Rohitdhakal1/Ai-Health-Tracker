import express from 'express';
import { addFood,getFoods } from '../controllers/foodCantroller';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Both routes need 'protect' because you must be logged in to eat!
router.route('/')
    .post(protect, addFood)  // POST /api/foods -> Add meal
    .get(protect, getFoods); // GET /api/foods  -> Get today's list

export default router;