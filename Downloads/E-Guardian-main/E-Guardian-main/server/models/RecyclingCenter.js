const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
    },
    contact: String,
    acceptedWaste: [String],
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

CenterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RecyclingCenter', CenterSchema);
