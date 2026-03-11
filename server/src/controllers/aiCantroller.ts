import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Google AI helpers
const extractJson = (text: string) => {
    try {
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');

        if (start === -1 || end === -1 || end < start) {
            return null;
        }

        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Extraction error:", error);
        return null;
    }
};

// food tracking AI logic
export const analyzeFood = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key is missing from .env file");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: "Text is required" });
            return;
        }

        const prompt = `
            You are a nutritionist API. Analyze the text: "${text}".
            Identify food items. Estimate calories, protein, carbs, and fat.
            
            IMPORTANT: Return ONLY a valid JSON array.
            
            Example Output:
            [
                { "name": "Boiled Egg (2)", "calories": 140, "protein": 12, "carbs": 1, "fat": 10 },
                { "name": "Toast (1 slice)", "calories": 80, "protein": 3, "carbs": 15, "fat": 1 }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        console.log("AI RAW RESPONSE (Food):", textResponse);

        const data = extractJson(textResponse);
        if (!data) {
            console.error("Failed to parse AI response as JSON");
            res.status(500).json({ message: 'AI returned invalid data structure. Please try again.' });
            return;
        }

        res.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: 'Failed to analyze food. ' + (error as Error).message });
    }
};

// exercise analysis AI logic
export const analyzeExercise = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key is missing from .env file");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: "Text is required" });
            return;
        }

        const prompt = `
            You are a fitness API. Analyze the text: "${text}".
            Identify the activity. If reps are given, estimate duration and calories.
            IMPORTANT: Return ONLY a valid JSON array.
            Example Output:
            [ { "activityName": "Pushups", "caloriesBurned": 50, "durationMinutes": 10 } ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        console.log("AI RAW RESPONSE (Exercise):", textResponse);

        const data = extractJson(textResponse);
        if (!data) {
            console.error("Failed to parse AI response as JSON");
            res.status(500).json({ message: 'AI returned invalid data structure. Please try again.' });
            return;
        }

        res.json(data);

    } catch (error) {
        console.error("AI Exercise Error:", error);
        res.status(500).json({ message: 'Failed to analyze exercise. ' + (error as Error).message });
    }
};