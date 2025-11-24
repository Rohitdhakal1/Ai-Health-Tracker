import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        
        //1 ERROR OF CONNECT DIRECTLT PROCEES.ENV.MONGO_URI
        const connStr = process.env.MONGO_URI;
        if (!connStr) {
        throw new Error('MONGO_URI is not defined in the .env file');
    }

        const conn = await mongoose.connect(connStr);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error as Error}.message`);
        process.exit(1);
    }
}

export default connectDB;
