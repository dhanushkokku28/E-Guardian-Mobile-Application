const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
    } catch (err) {
        console.error('Primary MongoDB Connection Error:', err.message);

        if (err.message.includes('ECONNREFUSED') || err.message.includes('timeout')) {
            console.log('--- ATTEMPTING LOCAL FALLBACK ---');
            try {
                const localURI = 'mongodb+srv://dhanushkokku8_db_user:root@cluster0.hvfqgin.mongodb.net/?appName=Cluster0';
                await mongoose.connect(localURI);
                console.log('Connected to LOCAL MongoDB successfully!');
            } catch (localErr) {
                console.error('Local MongoDB also failed. Please ensure MongoDB is installed and running locally.');
                console.error('TIP: If using Atlas, ensure your IP is whitelisted at cloud.mongodb.com');
            }
        }
    }
};

connectDB();

// Routes
app.use((req, res, next) => {
    console.log(`[HealthCheck] Path: ${req.path}, State: ${mongoose.connection.readyState}`);
    if (mongoose.connection.readyState !== 1 && req.path.startsWith('/api')) {
        return res.status(503).json({
            success: false,
            message: 'Database connection is not established. Current state: ' + mongoose.connection.readyState
        });
    }
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));

app.get('/', (req, res) => {
    res.send('Smart Waste & Hazard Detection API is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
