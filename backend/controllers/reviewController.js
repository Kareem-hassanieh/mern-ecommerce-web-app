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

 
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        errors: ['Review not found'],
        message: 'Review not found',
        data: null
      });
    }

   
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        errors: ['Unauthorized'],
        message: 'You can only update your own review',
        data: null
      });
    }

    
    review.rating = rating;
    review.reviewText = reviewText;

   
    await review.save();

    
    let sum_of_ratings = 0;
    let number_of_reviews = 0;

  
    const reviews = await Review.find({ product: productId });

    reviews.forEach(r => {
      sum_of_ratings += r.rating;
    });

    number_of_reviews = reviews.length;


    const average_rating = number_of_reviews > 0 ? sum_of_ratings / number_of_reviews : 0;

  
    product.number_of_reviews = number_of_reviews;
    product.sum_of_ratings = sum_of_ratings;
    product.average_rating = average_rating;

  
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


router.delete('/delete', async (req, res) => {
  const { reviewId, userId, productId } = req.body;

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


    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        errors: ['Review not found'],
        message: 'Review not found',
        data: null
      });
    }

   
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        errors: ['Unauthorized'],
        message: 'You can only delete your own review',
        data: null
      });
    }

  
    await Review.deleteOne({ _id: reviewId });

 
    let sum_of_ratings = 0;
    let number_of_reviews = 0;

   
    const reviews = await Review.find({ product: productId });

    reviews.forEach(r => {
      sum_of_ratings += r.rating;
    });

    number_of_reviews = reviews.length;

 
    const average_rating = number_of_reviews > 0 ? sum_of_ratings / number_of_reviews : 0;

    product.number_of_reviews = number_of_reviews;
    product.sum_of_ratings = sum_of_ratings;
    product.average_rating = average_rating;

   
    await product.save();

    res.status(200).json({
      errors: null,
      message: 'Review was deleted successfully!',
      data: null
    });

  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while deleting the review',
      data: null
    });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        errors: ["Review not found"],
        message: "No review with the provided ID",
        data: null,
      });
    }

   
    const user = await User.findById(review.user, 'name email'); // Fetch specific fields
    const product = await Product.findById(review.product, 'name description price'); 
    const reviewWithDetails = {
      ...review.toObject(),
      user,
      product,
    };

    res.status(200).json({
      errors: null,
      message: "Review retrieved successfully",
      data: reviewWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: "Something went wrong while retrieving the review",
      data: null,
    });
  }
});






module.exports = { ReviewController: router };

