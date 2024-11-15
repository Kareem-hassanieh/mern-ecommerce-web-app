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

router.put('/update', async (req, res) => {
    const { id, name, email, password } = req.body; 

    try {
        if (!id) {
            return res.status(400).json({
                errors: ["User ID is required"],
                message: "Please provide the user ID",
                data: null
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password }, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({
                errors: ["User not found"],
                message: "No user found with the given ID",
                data: null
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User updated successfully!',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message],
            message: "Something went wrong!",
            data: null
        });
    }
});


module.exports = { UserController: router };
