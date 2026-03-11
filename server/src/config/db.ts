import mongoose from "mongoose";
import dns from "dns";

// database connection logic
const connectDB = async () => {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }

    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error as Error}.message`);
    process.exit(1);
  }
};

export default connectDB;
