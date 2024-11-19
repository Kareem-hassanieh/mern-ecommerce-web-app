const express = require('express');
const bcrypt = require('bcrypt');
const  signToken  = require('../utils/signToken'); 
const User = require('../models/User');

const router = express.Router(); 


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

      
   

       
        res.status(200).json({
            errors: null,
            message: 'Login successful',
            data: signToken(user),
          
        });
        console.log(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [error.message],
            message: 'Something went wrong!',
            data: null,
        });
    }
});


module.exports = { AuthController: router };

