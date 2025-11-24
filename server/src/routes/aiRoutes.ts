import express  from "express";

import { analyzeExercise, analyzeFood } from "../controllers/aiCantroller";
import { protect } from "../middleware/authMiddleware";
const router =express.Router();

router.post('/food',protect,analyzeFood);
router.post('/exercise', protect, analyzeExercise);

export default router;

