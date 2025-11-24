import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// --- HELPER: GENERATE TOKEN ---
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// --- HELPER: CALCULATE GOALS ---
const calculateGoals = (data: any) => {
    let bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age;

    if (data.gender === 'male' || data.gender === 'trans') bmr += 5;
    else bmr -= 161;

    const activityMultipliers: any = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
    };
    let tdee = bmr * (activityMultipliers[data.activityLevel] || 1.2);

    if (data.currentWeight > data.targetWeight) {
        return Math.round(tdee - 500);
    } else if (data.currentWeight < data.targetWeight) {
        return Math.round(tdee + 500);
    }

    return Math.round(tdee);
}

// --- HELPER: HANDLE STREAK LOGIC ---
const updateStreak = async (user: any) => {
    const today = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

    // First time ever logging in
    if (!lastLogin) {
        user.streak = 1;
        user.lastLogin = today;
        await user.save();
        return;
    }

    // Compare Dates (ignore time)
    const todayString = today.toDateString();
    const lastLoginString = lastLogin.toDateString();

    // 1. If logged in today, do nothing
    if (todayString === lastLoginString) {
        return;
    }

    // 2. Check if consecutive (Yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLoginString === yesterday.toDateString()) {
        user.streak += 1; 
    } else {
        user.streak = 1; // Broken streak
    }

    // Save
    user.lastLogin = today;
    await user.save();
};

// --- REGISTER CONTROLLER ---
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, gender, age, height, currentWeight, targetWeight, activityLevel } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const calorieGoal = calculateGoals({
            gender, age, height, weight: currentWeight, activityLevel, currentWeight, targetWeight
        });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            age,
            height,
            currentWeight,
            targetWeight,
            activityLevel,
            calorieGoal,       // <--- Fixed: Added comma here
            streak: 1,         // Start at Day 1
            lastLogin: new Date(), 
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                calorieGoal: user.calorieGoal,
                streak: user.streak, // Send the "1"
                token: generateToken(user._id as unknown as string)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.log("Register Error", error);
        res.status(500).json({ message: (error as Error).message });
    }
}

// --- LOGIN CONTROLLER ---
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // Run Streak Logic
            await updateStreak(user);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                calorieGoal: user.calorieGoal,
                streak: user.streak, // <--- Fixed: Added this so Dashboard updates!
                token: generateToken(user._id as unknown as string)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}