const mongoose = require('mongoose');
const { Schema } = mongoose;


const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true, 
      },
      quantity: {
        type: Number,
        required: true, 
      },
      price: {
        type: Number,
        required: true, 
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true, 
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending', 
  },
  shippingAddress: {
    type: String,
    required: true, 
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});


const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
