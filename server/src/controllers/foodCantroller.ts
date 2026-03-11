// food tracking controller

import { Response } from 'express';
import Food from '../models/Food';

// date range helper
const getDayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// naya food entry
export const addFood = async (req: any, res: Response) => {
    try {
        const { name, calories, protein, carbs, fat } = req.body;

        const food = await Food.create({
            user: req.user._id,
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

// fetch daily meals
export const getFoods = async (req: any, res: Response) => {
    try {
        const { start, end } = getDayRange();

        const foods = await Food.find({
            user: req.user._id,
            date: { $gte: start, $lte: end }
        });

        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

