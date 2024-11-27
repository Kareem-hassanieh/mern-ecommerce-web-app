const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package
const { UserController } = require('./controllers/userController');
const { ProductController } = require('./controllers/productController');
const { ReviewController } = require('./controllers/ReviewController');
const { LikeController } = require('./controllers/likeController');
const { CartController } = require('./controllers/CartController');
const { OrderController } = require('./controllers/OrderController');



const path = require('path');

// Configure dotenv for environment variables
dotenv.config();

// Initialize the Express app
const app = express();

app.use(express.json());

// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors()); // CORS middleware should be applied after initializing the app

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Prefix for the API
const prefix = '/api';
const version = '/v1';

// Define API routes
app.use(prefix + version + '/user', UserController);
app.use(prefix + version + '/product', ProductController);
app.use(prefix + version + '/review', ReviewController);
app.use(prefix + version + '/like', LikeController);
app.use(prefix + version + '/cart', CartController);
app.use(prefix + version + '/order', OrderController);


// Connect to MongoDB and start the server
mongoose.connect(process.env.DATABASE_URL || '', clientOptions)
    .then(() => console.log("Connected to MongoDB!"))
    .then(() => app.listen(5000, () => {
        console.log("Server started on port 5000");
    }))
    .catch(err => console.error("Could not connect to MongoDB", err));
