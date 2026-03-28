const mongoose = require('mongoose');

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

const User = connection.model('User', userSchema);

module.exports = User;