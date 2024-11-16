const mongoose = require('mongoose');
const { Schema } = mongoose;


const CartSchema = new Schema({
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
        min: 1, 
      },
    },
  ],
  total_price: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});


CartSchema.pre('save', async function (next) {
  const cart = this;

  try {
    const Product = mongoose.model('Product'); 
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    cart.total_price = total; // Update the total price
    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
