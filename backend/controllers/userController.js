const express = require('express');
const  User = require('../models/User'); // Adjust the path to your User model

const router = express.Router();

// Create a new user
router.post('/create', async (req, res) => {
    const { password, email, name } = req.body;

    const user = new User({
        name: name,
        password: password,
        email: email
    });

    try {
        await user.save();
        res.status(200).json({
            errors: null,
            message: 'User was created successfully!',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message],
            message: "Something went wrong!",
            data: null
        });
    }
});

// Export the router for use in index.js
module.exports = { UserController: router };
