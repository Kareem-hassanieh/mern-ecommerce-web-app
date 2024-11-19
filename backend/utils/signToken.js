const jwt = require('jsonwebtoken');

const signToken = (user) => {
    let token = jwt.sign({ ...user.toObject(), password: '' }, process.env.SECRET_KEY);
    return token;
};

// Export using CommonJS syntax
module.exports = signToken;
