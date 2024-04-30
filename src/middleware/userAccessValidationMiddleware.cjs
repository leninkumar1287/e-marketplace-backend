const jsonwebtoken = require('jsonwebtoken');
const { jwt, checkTokenIsBlacListed } = require('../services/config.service.cjs');
const { StatusCodes } = require('http-status-codes');
const UserModel = require('../model/userModel.cjs');
const { errorMsgFormat, validationFormat } = require('../services/utils/messageFormatter.cjs');

const verifyToken = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    let checkLoggedOutOrNot = checkTokenIsBlacListed(token);
    
    if ((checkLoggedOutOrNot)) {
        return res.status(401).send(validationFormat('This token has been expired or its deleted by the user, this token is now invalid'))
    }

    let verify_token = jsonwebtoken.verify(token, jwt.jwtSecretKey)
    // Check if user exists based on the decoded token
    UserModel.findOne({ userEmail: verify_token.userEmail }).then((user, err) => {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: "User Not Authorized", err })
        }
        next();
    })
};

module.exports = {
    verifyToken
}