import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI with your Key from .env
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// --- THE LOGIC ---
export const analyzeFood = async (req: Request, res: Response): Promise<void> => {
    try {

        // 1. Debugging: Check if the key exists now
        console.log("MY API KEY IS:", process.env.GEMINI_API_KEY ? "Found!" : "MISSING ❌");

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key is missing from .env file");
        }

        // 2. Initialize Gemini HERE (Just in time)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 1. Get the text (e.g., "I ate 2 eggs and toast")
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ message: "Text is required" });
            return;
        }

        // 2. The Prompt Engineering (The most important part!)
        // We order the AI to speak ONLY in JSON.
        const prompt = `
            You are a nutritionist API. Analyze the text: "${text}".
            Identify food items. Estimate calories, protein, carbs, and fat.
            
            IMPORTANT: Return ONLY a valid JSON array. Do not use Markdown. Do not write explanations.
            
            Example Output:
            [
                { "name": "Boiled Egg (2)", "calories": 140, "protein": 12, "carbs": 1, "fat": 10 },
                { "name": "Toast (1 slice)", "calories": 80, "protein": 3, "carbs": 15, "fat": 1 }
            ]
        `;

        // 3. Call Google
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // 4. Clean the text (AI sometimes adds backticks like ```json ... ```)
        const cleanJson = textResponse.replace(/```json|```/g, '').trim();

        // 5. Convert text to Real JSON object
        const data = JSON.parse(cleanJson);

        // 6. Send to Frontend
        res.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: 'Failed to analyze food' });
    }
};

// --- EXERCISE ANALYZER ---
export const analyzeExercise = async (req: Request, res: Response): Promise<void> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        
        // --- USING GEMINI 2.0 FLASH HERE TOO ---
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const { text } = req.body;

        const prompt = `
            You are a fitness API. Analyze the text: "${text}".
            Identify the activity. If reps are given, estimate duration and calories.
            IMPORTANT: Return ONLY a valid JSON array. Do not use Markdown.
            Example Output:
            [ { "activityName": "Pushups", "caloriesBurned": 50, "durationMinutes": 10 } ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanText = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanText);

        res.json(data);

    } catch (error) {
        console.error("AI Exercise Error:", error);
        res.status(500).json({ message: 'Failed to analyze exercise' });
    }
};