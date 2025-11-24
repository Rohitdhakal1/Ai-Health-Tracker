import express from 'express';
import type{ Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import foodRoutes from './routes/foodRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import aiRoutes from './routes/aiRoutes';



const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());


app.use('/api/users',userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/ai',aiRoutes );

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.send('HealthTrack API is running!');
});

export default app;