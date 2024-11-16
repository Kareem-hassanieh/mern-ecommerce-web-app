const mongoose = require('mongoose');
const { Schema } = mongoose;


const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});


LikeSchema.index({ user: 1, product: 1 }, { unique: true });


const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
