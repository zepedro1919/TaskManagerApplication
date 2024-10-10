const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Generate token function 
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registration route
router.post('/register', async (req, res) => {
    console.log('Received request at /register'); // Log when the route is hit
    const { username, password } = req.body;

    try {
        console.log('Checking if user already exists...');
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating new user...');
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        console.log('User created successfully');
        const token = generateAccessToken({ id: newUser._id });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// Login route
router.post('/login', async (req, res) => {
    console.log('Received login request at /login');
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = generateAccessToken({ id: user._id });
        console.log('Login successful, sending token');
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

module.exports = router;