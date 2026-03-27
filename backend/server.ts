import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./api/userRoutes.js";
import "./models/User.js";
import "./models/Business.js";
import "./models/Review.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());

//API's:
app.use("/api", userRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});