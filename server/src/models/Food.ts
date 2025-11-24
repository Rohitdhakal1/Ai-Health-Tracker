import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
    user: mongoose.Types.ObjectId; // Link to the User who ate this
    name: string;
    calories: number;
    protein?: number; // Optional (?) - not everyone tracks macros
    carbs?: number;
    fat?: number;
    date: Date;
}

const FoodSchema :Schema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',// IMPORTANT: This links the meal to the User model
        required:true
    },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    date: { type: Date, default: Date.now } // Defaults to "Right Now"
},{
    timestamps:true // adds createdAt and Updated automatically
});

export default mongoose.model<IFood>('Food',FoodSchema);