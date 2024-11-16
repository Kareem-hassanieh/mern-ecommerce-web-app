
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { UserController } = require('./controllers/userController'); 

const { ProductController } = require('./controllers/productController'); 

const { ReviewController } = require('./controllers/ReviewController');


dotenv.config();


const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

const app = express();


app.use(express.json());


const prefix = '/api';
const version = '/v1'
app.use(prefix + version + '/user', UserController)

app.use(prefix + version + '/product', ProductController)

app.use(prefix + version + '/review', ReviewController)


mongoose.connect(process.env.DATABASE_URL || '', clientOptions)
    .then(() => console.log("Connected to MongoDB!"))
    .then(() => app.listen(5000, () => {
        console.log("Server started on port 5000")
    }))
    .catch(err => console.error("Could not connect to MongoDB", err));