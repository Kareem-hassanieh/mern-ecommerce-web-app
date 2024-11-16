const express = require('express');
const Cart = require('../models/Cart'); 
const Product = require('../models/Product'); 

const router = express.Router();


router.post('/create', async (req, res) => {
  const { userId, items } = req.body; 
  try {
    // Check if a cart already exists for the user
    const existingCart = await Cart.findOne({ user: userId });
    if (existingCart) {
      return res.status(400).json({
        errors: ["A cart already exists for this user."],
        message: "Failed to create a new cart.",
        data: null,
      });
    }

    // Calculate the total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          errors: [`Product with ID ${item.product} not found.`],
          message: "Failed to calculate total price.",
          data: null,
        });
      }
      totalPrice += product.price * item.quantity;
    }

    // Create a new cart
    const cart = new Cart({
      user: userId,
      items: items,
      total_price: totalPrice,
    });

    // Save the cart to the database
    await cart.save();

    res.status(201).json({
      errors: null,
      message: "Cart created successfully!",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: "Something went wrong while creating the cart.",
      data: null,
    });
  }
});

module.exports = { CartController: router };
