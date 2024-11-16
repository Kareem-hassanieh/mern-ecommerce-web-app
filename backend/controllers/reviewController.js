const express = require('express');

const Review = require("../models/Review")

const router = express.Router()

const User = require('../models/User');

const Product = require('../models/Product')

router.post('/create', async (req, res) => {
  const { userId, productId, rating, reviewText } = req.body;

  try {
 
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({
        errors: ['User not found'],
        message: 'User not found',
        data: null
      });
    }

    if (!product) {
      return res.status(404).json({
        errors: ['Product not found'],
        message: 'Product not found',
        data: null
      });
    }

  
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      reviewText
    });

    
    await review.save();

  
    product.number_of_reviews += 1;
    product.sum_of_ratings += rating;

  
    const average_rating = product.sum_of_ratings / product.number_of_reviews;


    product.average_rating = average_rating;

    
    await product.save();

    res.status(200).json({
      errors: null,
      message: 'Review was created successfully!',
      data: review
    });

  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while creating the review',
      data: null
    });
  }
});

module.exports = { ReviewController: router };

