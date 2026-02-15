const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Name, email, and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT secret is not configured' });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (err) {
        console.error('Register error:', err);
        if (err && err.code === 11000) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT secret is not configured' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
