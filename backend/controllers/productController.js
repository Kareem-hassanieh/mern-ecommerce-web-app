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

module.exports = { ProductController: router };