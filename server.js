const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Business = require("./models/Business");
const Review = require("./models/Review");

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/Marketplace')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});