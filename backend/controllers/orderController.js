const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const router = express.Router();

router.post('/create', async (req, res) => {
  const { user, shippingAddress } = req.body;

  try {
    
    const cart = await Cart.findOne({ user }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        errors: ['Cart is empty or does not exist.'],
        message: 'Order cannot be created without items in the cart.',
        data: null,
      });
    }

   
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    
    const order = new Order({
      user,
      items: cart.items, 
      totalAmount,
      shippingAddress,
    });

    
    await order.save();

   
    cart.items = [];
    await cart.save();

    res.status(200).json({
      errors: null,
      message: 'Order created successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while creating the order',
      data: null,
    });
  }
});
module.exports = { OrderController: router };
