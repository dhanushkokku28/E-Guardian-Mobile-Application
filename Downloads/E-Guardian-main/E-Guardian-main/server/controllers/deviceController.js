const Device = require('../models/Device');
const Hazard = require('../models/Hazard');

const classifyInput = ({ name, category }) => {
    const safeName = (name || 'Unknown device').toString().trim();
    const safeCategory = (category || 'Unknown').toString().trim();

    let hazardLevel = 'Low';
    let recommendations = ['Recycle at E-waste center'];
    let classificationResults = `Detected ${safeName} as ${safeCategory}.`;

    if (
        safeCategory.toLowerCase().includes('battery') ||
        safeName.toLowerCase().includes('phone')
    ) {
        hazardLevel = 'High';
        recommendations.push('Handle with care, contains lithium-ion');
    }

    return { safeName, safeCategory, hazardLevel, recommendations, classificationResults };
};

exports.classifyDevice = async (req, res) => {
    try {
        const { name, category, imageUrl } = req.body;

        const {
            safeName,
            safeCategory,
            hazardLevel,
            recommendations,
            classificationResults
        } = classifyInput({ name, category });

        const device = new Device({
            userId: req.user.id,
            name: safeName,
            category: safeCategory,
            hazardLevel,
            classificationResults,
            recommendations,
            imageUrl
        });

        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.classifyDeviceImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const { name, category } = req.body;
        const {
            safeName,
            safeCategory,
            hazardLevel,
            recommendations,
            classificationResults
        } = classifyInput({ name, category });

        const imageUrl = `/uploads/${req.file.filename}`;

        const device = new Device({
            userId: req.user.id,
            name: safeName,
            category: safeCategory,
            hazardLevel,
            classificationResults,
            recommendations,
            imageUrl
        });

        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const total = await Device.countDocuments({ userId: req.user.id });
        const highHazard = await Device.countDocuments({ userId: req.user.id, hazardLevel: 'High' });

        res.json({
            totalDevices: total,
            highHazardDevices: highHazard,
            co2Saved: total * 2.5 // Mock calculation: 2.5kg per device
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
