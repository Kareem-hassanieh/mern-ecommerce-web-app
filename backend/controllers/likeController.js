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
    
    const like = new Like({ user, product });
    await like.save();

    res.status(200).json({
      errors: null,
      message: 'Like added successfully!',
      data: like,
    });
  } catch (error) {
  
    if (error.code === 11000) {
      return res.status(409).json({
        errors: ['You already liked this product'],
        message: 'Duplicate like',
        data: null,
      });
    }

    
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
        message: 'Like removed ',
        data: null,
      });
    } else {
      
      const like = new Like({ user, product });
      await like.save();
      return res.status(200).json({
        errors: null,
        message: 'Like added ',
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
  
      const like = await Like.findOne({ user, product });
      if (!like) {
          return res.status(404).json({
              errors: ['Like not found'],
              message: 'No like entry was found for the given user and product.',
              data: null,
          });
      }

    
      await Like.deleteOne({ user, product });

      res.status(200).json({
          errors: null,
          message: 'Like deleted.',
          data: like, 
      });
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: 'Something went wrong while deleting the like.',
          data: null,
      });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      
      const like = await Like.findById(id)
          

      if (!like) {
          return res.status(404).json({
              errors: ['Like not found'],
              message: 'No like entry found with the provided ID.',
              data: null,
          });
      }

      res.status(200).json({
          errors: null,
          message: 'Like retrieved ',
          data: like,
      });
  } catch (error) {
      res.status(500).json({
          errors: [error.message],
          message: 'Something went wrong while retrieving the like.',
          data: null,
      });
  }
});



module.exports = { LikeController: router };
