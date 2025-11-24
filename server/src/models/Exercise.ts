import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
    user: mongoose.Types.ObjectId;
    activityName: string;
    caloriesBurned: number;
    durationMinutes: number;
    date: Date;
}

// 2. Mongoose Schema
const ExerciseSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    activityName: { type: String, required: true },
    caloriesBurned: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);