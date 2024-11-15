const express = require('express');
const  Product = require('../models/Product');

const router = express.Router();


router.post('/create', async (req, res) => {
  const { name, description, price, pictures, category, number_of_reviews, sum_of_ratings } = req.body;

  // Create a new Product instance
  const product = new Product({
      name,
      description,
      price,
      pictures,
      category,
      number_of_reviews,
      sum_of_ratings
  });

  try {
      // Save the product to the database
      await product.save();
      res.status(200).json({
          errors: null,
          message: 'Product was created successfully!',
          data: product
      });
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: "Something went wrong while creating the product",
          data: null
      });
  }
});



router.put('/update', async (req, res) => {
  const { id, name, description, price, pictures, category, number_of_reviews, sum_of_ratings } = req.body;

  if (!id) {
    return res.status(400).json({
      errors: ['Product ID is required'],
      message: 'Please provide the product ID in the request body',
      data: null
    });
  }

  try {
    // Find the product by ID and update it with the new data
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        pictures,
        category,
        number_of_reviews,
        sum_of_ratings
      },
      { new: true } // Return the updated product
    );

    // If the product was not found
    if (!product) {
      return res.status(404).json({
        errors: ['Product not found'],
        message: 'Product not found!',
        data: null
      });
    }

    // Return the updated product
    res.status(200).json({
      errors: null,
      message: 'Product updated successfully!',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while updating the product',
      data: null
    });
  }
});

router.delete('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      errors: ['Product ID is required'],
      message: 'Please provide the product ID in the request body',
      data: null
    });
  }

  try {
    // Find and delete the product by ID
    const product = await Product.findByIdAndDelete(id);

    // If no product was found with the provided ID
    if (!product) {
      return res.status(404).json({
        errors: ['Product not found'],
        message: 'Product not found!',
        data: null
      });
    }

    // Return a success message
    res.status(200).json({
      errors: null,
      message: 'Product deleted successfully!',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while deleting the product',
      data: null
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    // If the product doesn't exist
    if (!product) {
      return res.status(404).json({
        errors: ['Product not found'],
        message: 'No product found with the provided ID',
        data: null
      });
    }

    // If the product is found
    res.status(200).json({
      errors: null,
      message: 'Product retrieved successfully!',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while retrieving the product',
      data: null
    });
  }
});

module.exports = { ProductController: router };