const express = require('express');
const Like = require('../models/Like'); 

const router = express.Router();


router.post('/create', async (req, res) => {
  const { user, product } = req.body;

  if (!user || !product) {
    return res.status(400).json({
      errors: ['User and Product fields are required'],
      message: 'Invalid input',
      data: null,
    });
  }

  try {
    // Attempt to create a new like
    const like = new Like({ user, product });
    await like.save();

    res.status(200).json({
      errors: null,
      message: 'Like added successfully!',
      data: like,
    });
  } catch (error) {
    // Handle unique index violation (duplicate like)
    if (error.code === 11000) {
      return res.status(409).json({
        errors: ['You already liked this product'],
        message: 'Duplicate like',
        data: null,
      });
    }

    // Handle other errors
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while adding the like',
      data: null,
    });
  }
});


router.post('/update', async (req, res) => {
  const { user, product } = req.body;

  if (!user || !product) {
    return res.status(400).json({
      errors: ['User and Product fields are required'],
      message: 'Invalid input',
      data: null,
    });
  }

  try {
    
    const existingLike = await Like.findOne({ user, product });

    if (existingLike) {
    
      await existingLike.deleteOne();
      return res.status(200).json({
        errors: null,
        message: 'Like removed successfully!',
        data: null,
      });
    } else {
      
      const like = new Like({ user, product });
      await like.save();
      return res.status(200).json({
        errors: null,
        message: 'Like added successfully!',
        data: like,
      });
    }
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
      message: 'Something went wrong while toggling the like',
      data: null,
    });
  }
});


router.delete('/delete', async (req, res) => {
  const { user, product } = req.body;

  try {
      // Check if the like exists
      const like = await Like.findOne({ user, product });
      if (!like) {
          return res.status(404).json({
              errors: ['Like not found'],
              message: 'No like entry was found for the given user and product.',
              data: null,
          });
      }

      // Delete the like
      await Like.deleteOne({ user, product });

      res.status(200).json({
          errors: null,
          message: 'Like was successfully deleted.',
          data: like, // Returning the deleted like for reference
      });
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: 'Something went wrong while deleting the like.',
          data: null,
      });
  }
});
module.exports = { LikeController: router };
