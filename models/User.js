const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/Marketplace');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    }
});

const User = connection.model('User', userSchema);

module.exports = User;
