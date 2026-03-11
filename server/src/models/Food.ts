import mongoose, { Document, Schema } from 'mongoose';

// food item model
export interface IFood extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    date: Date;
}

const FoodSchema :Schema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
},{
    timestamps:true
});

export default mongoose.model<IFood>('Food',FoodSchema);