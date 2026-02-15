const mongoose = require('mongoose');
const Hazard = require('../models/Hazard');
const RecyclingCenter = require('../models/RecyclingCenter');
require('dotenv').config();

const hazards = [
    { component: 'Lithium-ion Battery', hazardDescription: 'Highly flammable and toxic if punctured.', classification: 'Flammable/Toxic', disposalGuide: 'Do not throw in regular trash. Take to dedicated e-waste facility.' },
    { component: 'Lead-acid Battery', hazardDescription: 'Contains corrosive acid and toxic lead.', classification: 'Corrosive/Toxic', disposalGuide: 'Must be recycled at automotive or specialized recycling centers.' },
    { component: 'Mercuric Oxide Battery', hazardDescription: 'Contains mercury, a potent neurotoxin.', classification: 'Toxic', disposalGuide: 'Hazardous waste collection only.' }
];

const centers = [
    { name: 'Green Earth Recycling', address: '123 Eco Lane, Tech City', location: { coordinates: [77.5946, 12.9716] }, contact: '555-0101', acceptedWaste: ['E-waste', 'Plastic', 'Metal'], rating: 4.5 },
    { name: 'Urban Waste Solutions', address: '456 Sustain Blvd, Green Town', location: { coordinates: [77.6413, 12.9279] }, contact: '555-0102', acceptedWaste: ['Hazardous', 'E-waste'], rating: 4.8 }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Hazard.deleteMany();
        await RecyclingCenter.deleteMany();
        await Hazard.insertMany(hazards);
        await RecyclingCenter.insertMany(centers);
        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
