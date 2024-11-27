const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
       // @ts-ignore
      const userId = req.user._id
      const newOrder = {
          products: [],
          user: userId,
          address: 'Address of the user',
      }

      const cart = await Cart.findOne({
          user: userId
      })

      if (!cart) {
          throw new Error('Cart is not found!')
      }
      let cartProducts = cart.products

      // Get product info from DB
      let productIds = cartProducts.map(item => item.product)
      const products = await Product.find({
          _id: {
              $in: productIds
          }
      })

      newOrder.products = cartProducts.map((cartProduct) => {
          // @ts-ignore
          const targetProduct = products.find(product => product._id.toString() == cartProduct.product.toString())
          return {
              product: cartProduct.product,
              quantity: cartProduct.quantity,
              priceOfOne: targetProduct?.price
          }
      })

      // at this point we can calculate total price
      let totalPrice = 0
      newOrder.products.forEach((product) => {
          totalPrice = totalPrice + (product.quantity * product.priceOfOne)
      })
      newOrder.totalPrice = totalPrice

      // create order
      const order = new Order(newOrder)
      await order.save()

      // clear cart
      // await Cart.findOneAndUpdate({
      //     user: userId
      // },
      //     { ...cart, products: [] },
      //     { new: true }
      // )

      res.status(200).json({
          errors: null,
          message: "Order created!",
          data: order
      })
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: "Something went wrong!",
          data: null
      })
  }
})

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
