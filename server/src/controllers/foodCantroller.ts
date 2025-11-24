//Add Food:Saving a meal to the database linked to the user.

import { Response } from 'express';
import Food from '../models/Food';

// Helper: Get start of today (00:00:00) and end of today (23:59:59)
// This is crucial for "Daily" tracking
const getDayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
};

// @desc    Add a new meal
// @route   POST /api/foods
// @access  Private (Needs Token)
export const addFood = async (req: any, res: Response) => {
    try {
        const { name, calories, protein, carbs, fat } = req.body;

        const food = await Food.create({
            user: req.user._id, // We get this from the 'protect' middleware!
            name,
            calories,
            protein,
            carbs,
            fat,
            date: new Date()
        });

        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all meals for TODAY
// @route   GET /api/foods
// @access  Private
export const getFoods = async (req: any, res: Response) => {
    try {
        const { start, end } = getDayRange();

        // Find foods that belong to THIS user AND are between 00:00 and 23:59 today
        const foods = await Food.find({
            user: req.user._id,
            date: { $gte: start, $lte: end }
        });

        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

