
const jwt = require('jsonwebtoken');



function signToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
}

module.exports = { signToken };