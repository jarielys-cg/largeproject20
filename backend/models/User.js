import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isBusinessOwner: {
        type: Boolean,
        default: false
    },
    zipCode: {
        type: Number
    }
});

const User = mongoose.model("User", userSchema);

export default User;