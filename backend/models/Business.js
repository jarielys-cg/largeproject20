const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    websiteLink: {
        type: String
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    averageReviewScore: {
        type: Number,
        default: 0
    }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;