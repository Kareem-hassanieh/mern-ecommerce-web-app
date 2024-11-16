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

router.post('/update', async (req, res) => {
  const { cartId, items } = req.body; // Expect cartId and items in the request body

  try {
    // Find the cart
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        errors: [`Cart with ID ${cartId} not found.`],
        message: "Failed to update the cart.",
        data: null,
      });
    }

    // Calculate the new total price
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

    // Update the cart items and total price
    cart.items = items;
    cart.total_price = totalPrice;

    // Save the updated cart to the database
    await cart.save();

    res.status(200).json({
      errors: null,
      message: "Cart updated successfully!",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: "Something went wrong while updating the cart.",
      data: null,
    });
  }
});

router.delete('/delete', async (req, res) => {
  const { cartId } = req.body; // Expect cartId in the request body

  try {
    // Find the cart and delete it
    const cart = await Cart.findByIdAndDelete(cartId);

    if (!cart) {
      return res.status(404).json({
        errors: [`Cart with ID ${cartId} not found.`],
        message: "Failed to delete the cart.",
        data: null,
      });
    }

    res.status(200).json({
      errors: null,
      message: "Cart deleted successfully!",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: "Something went wrong while deleting the cart.",
      data: null,
    });
  }
});

module.exports = { CartController: router };
