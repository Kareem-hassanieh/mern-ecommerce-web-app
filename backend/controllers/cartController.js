const express = require('express');
const Cart = require('../models/Cart'); 
const Product = require('../models/Product'); 
const auth = require('../middleware/AuthMiddleware');

const router = express.Router();



router.get('/get', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the cart for the logged-in user and populate the product details
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: 'Your cart is empty!',
        data: [],
      });
    }

    res.status(200).json({
      message: 'Cart fetched successfully!',
      data: cart.items, // Contains product details and quantities
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong!',
    });
  }
});

router.put('/update', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = req.body.cart;

    if (!cartItems || typeof cartItems !== 'object') {
      return res.status(400).json({ message: 'Invalid cart format.' });
    }

    // Find the user's cart or initialize a new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Update quantities or add new products to the cart
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const existingItem = cart.items.find(item => item.product.toString() === productId);

      if (existingItem) {
        // Update quantity if the product already exists
        existingItem.quantity += Number(quantity);
      } else {
        // Add new product to the cart
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }
    });

    // Recalculate total price
    await cart.save(); // `pre('save')` will handle the total price calculation

    res.status(200).json({
      errors: null,
      message: 'Cart updated successfully!',
      data: cart,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong!',
      data: null,
    });
  }
});

// router.put('/update', auth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const cartItems = req.body.cart; // Assuming cart is an object with productId as keys

//     if (!cartItems || typeof cartItems !== 'object') {
//       return res.status(400).json({ message: 'Invalid cart format' });
//     }

//     const newItems = Object.entries(cartItems).map(([productId, quantity]) => ({
//       product: productId,
//       quantity: Number(quantity),
//     }));

//     const cart = await Cart.findOneAndUpdate(
//       { user: userId },
//       { $set: { items: newItems } },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({
//       errors: null,
//       message: 'Cart updated successfully!',
//       data: cart,
//     });
//   } catch (error) {
//     console.error('Error updating cart:', error);
//     res.status(500).json({
//       errors: [error.message],
//       message: 'Something went wrong!',
//       data: null,
//     });
//   }
// });


router.post('/create', async (req, res) => {
  const { userId, items } = req.body; 
  try {
   
    const existingCart = await Cart.findOne({ user: userId });
    if (existingCart) {
      return res.status(400).json({
        errors: ["A cart already exists for this user."],
        message: "Failed to create a new cart.",
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

    
    const cart = new Cart({
      user: userId,
      items: items,
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
