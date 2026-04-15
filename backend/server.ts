import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./api/userRoutes.js";
import businessRoutes from "./api/businessRoutes.js";
import reviewRoutes from "./api/review.js";
import verifyEmailRoutes from "./api/verifyEmail.js";

import "./models/User.js";
import "./models/Business.js";
import "./models/Review.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.set("bufferCommands", false);

const buildMongoUri = (): string => {
    const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env;

    if (!MONGO_USER || !MONGO_PASS || !MONGO_CLUSTER || !MONGO_DB) {
        throw new Error("Missing MongoDB env vars. Required: MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB");
    }

    return `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASS)}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;
};

//middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: false
}))

//API's:
app.use("/api", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", businessRoutes);
app.use("/api", verifyEmailRoutes);

const startServer = async () => {
    try {
        const uri = buildMongoUri();
        const mongoDb = process.env.MONGO_DB as string;

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            dbName: mongoDb,
        });

        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Failed to start server: MongoDB connection error", err);
        process.exit(1);
    }
};

startServer();
