const express = require('express');
const Cart = require('../models/Cart'); 
const Product = require('../models/Product'); 

const router = express.Router();


router.post('/create', async (req, res) => {
  const { userId, items } = req.body;

  try {
    // Check if a cart exists for this user
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Add new products or update quantities for existing ones
      for (const newItem of items) {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.product.toString() === newItem.product
        );

        if (existingItemIndex > -1) {
          // If the product exists, update its quantity
          cart.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          // If the product doesn't exist, add it
          cart.items.push(newItem);
        }
      }

      // Recalculate total price
      let totalPrice = 0;
      for (const item of cart.items) {
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
      cart.total_price = totalPrice;

      await cart.save();

      return res.status(200).json({
        errors: null,
        message: 'Product added to existing cart successfully!',
        data: cart,
      });
    }

    // If no cart exists, create a new one
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

    cart = new Cart({
      user: userId,
      items,
      total_price: totalPrice,
    });

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
  const { cartId, items } = req.body; 

  try {
    
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        errors: [`Cart with ID ${cartId} not found.`],
        message: "Failed to update the cart.",
        data: null,
      });
    }

  
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

    
    cart.items = items;
    cart.total_price = totalPrice;

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
  const { cartId } = req.body; 

  try {
  
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


// router.get('/:id', async (req, res) => {
//   const { id } = req.params; 
//   try {

//     const cart = await Cart.findById(id).populate('user', 'name email');
//     if (!cart) {
//       return res.status(404).json({
//         errors: [`Cart with ID ${id} not found.`],
//         message: "Failed to retrieve the cart.",
//         data: null,
//       });
//     }

//     res.status(200).json({
//       errors: null,
//       message: "Cart retrieved successfully!",
//       data: cart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       errors: [error.message],
//       message: "Something went wrong while retrieving the cart.",
//       data: null,
//     });
//   }
// });

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;  // Get the userId from the request params

  try {
    // Find the cart for this user
    const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Populate products in items

    if (!cart) {
      return res.status(404).json({
        errors: [`Cart not found for user with ID ${userId}`],
        message: "Failed to retrieve the cart.",
        data: null,
      });
    }

    res.status(200).json({
      errors: null,
      message: "Cart retrieved successfully!",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: "Something went wrong while retrieving the cart.",
      data: null,
    });
  }
});


module.exports = { CartController: router };
