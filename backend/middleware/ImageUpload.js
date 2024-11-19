const multer = require('multer');
const path = require('path');

// Configure storage for images
const imageStorage = multer.diskStorage({
    destination: 'images/', // Directory where images will be stored
    filename: function (req, file, callback) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniquePrefix + '-' + file.originalname);
    },
});

// Initialize the multer middleware
const ImageUpload = multer({ storage: imageStorage });

module.exports = ImageUpload;