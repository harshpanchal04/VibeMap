const mongoose = require('mongoose');

const vibeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    prompt: {
        type: String,
        required: true,
    },
    itineraryJson: {
        type: Object, // Storing the full JSON object from Gemini
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Vibe', vibeSchema);
