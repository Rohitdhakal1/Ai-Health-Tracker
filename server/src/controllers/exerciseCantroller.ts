import { Response } from "express";
import Exercise from "../models/Exercise";

// Helper: Get start/end of today
const getDayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// @desc    Add a new exercise
// @route   POST /api/exercises
// @access  Private
export const addExercise = async(req:any, res:Response)=>{
    try {
        const { activityName, caloriesBurned, durationMinutes } = req.body;

        const exercise = await Exercise.create({
            user: req.user._id,
            activityName,
            caloriesBurned,
            durationMinutes,
            date: new Date()
        });

        res.status(201).json(exercise);
    } catch (error) {
        
    }
};


// @desc    Get all exercises for TODAY
// @route   GET /api/exercises
// @access  Private
export const getExercises = async (req: any, res: Response) => {
    try {
        const { start, end } = getDayRange();

        const exercises = await Exercise.find({
            user: req.user._id,
            date: { $gte: start, $lte: end }
        });

        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};