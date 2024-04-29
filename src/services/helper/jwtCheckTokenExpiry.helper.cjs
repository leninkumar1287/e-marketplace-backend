const jsonwebtoken = require('jsonwebtoken')
const { jwt } = require('../config.service.cjs');
const { errorMsgFormat, successFormat } = require('../utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
exports.checkTokenExpiry = (token) => {
    try {
        const decodedToken = jsonwebtoken.verify(token, jwt.jwtSecretKey);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) return true;
        else false;
    } catch (error) {
        return errorMsgFormat(error, 'JWT Token Expiry Checking', StatusCodes.BAD_REQUEST);
    }
};