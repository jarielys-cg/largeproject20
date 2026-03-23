require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Business = require("./models/Business");
const Review = require("./models/Review");

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => console.error("MongoDB connection error:", err));


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});