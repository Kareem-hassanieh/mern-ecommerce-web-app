const mongoose = require('mongoose');
const { Schema } = mongoose;


const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',  
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
  
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});


const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;