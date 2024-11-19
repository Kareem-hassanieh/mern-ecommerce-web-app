const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        
        if (!authHeader) {
            throw new Error('Authorization header missing!');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new Error('Invalid auth header!');
        }

        const user = jwt.verify(token, process.env.SECRET_KEY);

        req.user = user;
        // If everything is fine
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            errors: [error.message],
            message: 'Not authorized!',
            data: null,
        });
    }
};

// Export the `auth` middleware
module.exports = auth;
