const mongoose = require('mongoose');

const HazardSchema = new mongoose.Schema({
    component: { type: String, required: true }, // e.g., "Lithium Battery"
    hazardDescription: { type: String, required: true },
    classification: { type: String, required: true }, // "Toxic", "Flammable", etc.
    disposalGuide: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hazard', HazardSchema);
