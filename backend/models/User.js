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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email regex validation
      },
      message: 'Invalid email address.',
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v); // Password regex validation
      },
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
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

