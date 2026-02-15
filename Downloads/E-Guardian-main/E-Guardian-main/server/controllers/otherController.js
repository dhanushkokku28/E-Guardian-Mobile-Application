const RecyclingCenter = require('../models/RecyclingCenter');
const Hazard = require('../models/Hazard');

// Center Controllers
exports.getCenters = async (req, res) => {
    try {
        const centers = await RecyclingCenter.find();
        res.json(centers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCenter = async (req, res) => {
    try {
        const center = new RecyclingCenter(req.body);
        await center.save();
        res.status(201).json(center);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hazard Controllers
exports.getHazards = async (req, res) => {
    try {
        const hazards = await Hazard.find();
        res.json(hazards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createHazard = async (req, res) => {
    try {
        const hazard = new Hazard(req.body);
        await hazard.save();
        res.status(201).json(hazard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
