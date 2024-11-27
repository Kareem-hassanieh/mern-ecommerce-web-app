const express = require('express');
const User = require('../models/User'); 


const bcrypt = require('bcrypt');
const  signToken  = require('../utils/signToken'); 


const router = express.Router();


router.post('/create', async (req, res) => {
    const { password, email, name } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    
    if (!passwordRegex.test(password)) {


        return res.status(400).json({
            errors: ['Password validation failed'],
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            data: null
        });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({
        name: name,
        password: hashedPassword,
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'Invalid email or password',
                data: null,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                errors: ['Invalid password'],
                message: 'Invalid email or password',
                data: null,
            });
        }

        const token = signToken(user);
        console.log(token); // Log the token instead of undefined `data`

        return res.status(200).json({
            errors: null,
            message: 'Login successful',
            data: token, // Provide the token as data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errors: [error.message],
            message: 'Something went wrong!',
            data: null,
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

router.delete('/delete', async (req, res) => {
    const { id } = req.body; // Extract the ID from the request body

    try {
        const user = await User.findByIdAndDelete(id); // Find and delete the user by ID

        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'No user found with the provided ID',
                data: null
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message],
            message: "Something went wrong while deleting the user",
            data: null
        });
    }
});


// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL parameters

    try {
        const user = await User.findById(id); // Find the user by ID

        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'No user found with the provided ID',
                data: null
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message],
            message: "Something went wrong while retrieving the user",
            data: null
        });
    }
});



module.exports = { UserController: router };
