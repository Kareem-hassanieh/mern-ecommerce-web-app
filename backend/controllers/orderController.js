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

router.post('/update', async (req, res) => {
  const { orderId, shippingAddress, status } = req.body;

  try {
   
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        errors: ['Order not found.'],
        message: 'Cannot update a non-existing order.',
        data: null,
      });
    }

 
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    if (status) {
      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          errors: ['Invalid status value.'],
          message: `Status must be one of: ${validStatuses.join(', ')}`,
          data: null,
        });
      }
      order.status = status;
    }

   
    await order.save();

    res.status(200).json({
      errors: null,
      message: 'Order updated successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while updating the order.',
      data: null,
    });
  }
});


router.delete('/delete', async (req, res) => {
  const { orderId } = req.body;

  try {

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        errors: ['Order not found.'],
        message: 'Cannot delete a non-existing order.',
        data: null,
      });
    }

   
    await order.remove();

    res.status(200).json({
      errors: null,
      message: 'Order deleted successfully!',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while deleting the order.',
      data: null,
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
   
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        errors: ['Order not found.'],
        message: 'The order with the given ID does not exist.',
        data: null,
      });
    }

   
    res.status(200).json({
      errors: null,
      message: 'Order retrieved successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while retrieving the order.',
      data: null,
    });
  }
});



module.exports = { OrderController: router };
