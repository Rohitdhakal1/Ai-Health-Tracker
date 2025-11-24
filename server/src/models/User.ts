import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    gender:'male' | 'female' | 'trans';
    age:number;
    height:number;
    activityLevel:'sedentary' | 'light' | 'moderate' | 'active';
    
    currentWeight: number; // Needed for BMR Math
    targetWeight: number;  // Needed for Motivation/Goals

    calorieGoal:number;

    streak: number;
    lastLogin: Date;
    
    createdAt:Date;


}

const UserSchema:Schema=new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique prevents duplicate emails
    password: { type: String, required: true },
    
    gender:{ type: String, enum: ['male', 'female'], required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    activityLevel: { 
        type: String, 
        enum: ['sedentary', 'light', 'moderate', 'active'], 
        default: 'sedentary' 
    },
    currentWeight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },

    calorieGoal: { type: Number, default: 2000 },
},
{    
    timestamps:true
});


export default mongoose.model<IUser>('User', UserSchema);