import mongoose from "mongoose";

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
        type: [String],
        required: true,
        default: []
    },
    description: {
        type: String,
    },
    image: {
        type: [String],
        default: []
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
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

const Business = mongoose.model("Business", businessSchema);

export default Business;