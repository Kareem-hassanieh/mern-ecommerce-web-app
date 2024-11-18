const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
      },
      message: 'Invalid email address.',
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;

