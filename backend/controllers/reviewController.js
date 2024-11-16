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


router.put('/update', async (req, res) => {
  const { reviewId, userId, productId, rating, reviewText } = req.body;

  try {
    // Check if the user and product exist
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

    // Find the review to update
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        errors: ['Review not found'],
        message: 'Review not found',
        data: null
      });
    }

    // Make sure the user is the one who wrote the review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        errors: ['Unauthorized'],
        message: 'You can only update your own review',
        data: null
      });
    }

    // Update the review fields
    review.rating = rating;
    review.reviewText = reviewText;

    // Save the updated review
    await review.save();

    // Recalculate the product's number_of_reviews and sum_of_ratings
    let sum_of_ratings = 0;
    let number_of_reviews = 0;

    // Fetch all reviews for the product to recalculate ratings
    const reviews = await Review.find({ product: productId });

    reviews.forEach(r => {
      sum_of_ratings += r.rating;
    });

    number_of_reviews = reviews.length;

    // Calculate the new average rating
    const average_rating = number_of_reviews > 0 ? sum_of_ratings / number_of_reviews : 0;

    // Update the product's number_of_reviews, sum_of_ratings, and average_rating
    product.number_of_reviews = number_of_reviews;
    product.sum_of_ratings = sum_of_ratings;
    product.average_rating = average_rating;

    // Save the updated product
    await product.save();

    res.status(200).json({
      errors: null,
      message: 'Review was updated successfully!',
      data: review
    });

  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while updating the review',
      data: null
    });
  }
});


module.exports = { ReviewController: router };

