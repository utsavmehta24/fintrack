import mongoose from "mongoose";

export async function connectDb() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB is already connected");
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "Main",
        });

        console.log("MongoDB connected");

    } catch (error) {
        console.log("Failed to connect to MongoDB");
        console.log(error);
    }
}