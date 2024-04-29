const UserModel = require('../model/userModel.cjs');
const { insertOne, deleteOne, updateOne, findOne, insertMany, findOneUsingQuery } = require('../services/mongodb.service.cjs');
const { successFormat, errorMsgFormat } = require('../services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');
const { jwt, addBlackListedToken, checkTokenIsBlacListed } = require('../services/config.service.cjs');
const { checkTokenExpiry } = require('../services/helper/jwtCheckTokenExpiry.helper.cjs');

exports.registration = async (request, response) => {
    try {
        let body = request.body;
        const { password } = body;
        const hashedPassword = await bcrypt.hash(password, 10)
        body.password = hashedPassword;
        //Check the Data Exists or Not
        let insertStatus = await insertOne(body)
        if (insertStatus.isExists != false) 
        return response
        .status(StatusCodes.CREATED)
        .send(successFormat(insertStatus.result, 'Registration',StatusCodes.CREATED,'Inserted document into the collection'))
        else return response
        .status(StatusCodes.CONFLICT)
        .send(errorMsgFormat({message : `${insertStatus.duplicateField} already exists` }, 'Registration',StatusCodes.CONFLICT))
    } catch (error) {
        return response
        .status(StatusCodes.BAD_REQUEST)
        .send(errorMsgFormat({message : error.message}, "Registration", StatusCodes.BAD_REQUEST))
    }
}

exports.signin = async (req, res) => {
    try {
        let body = req.body
        let checkEmailIsRegistered = await findOneUsingQuery({ userEmail: body.emailId })
        if (checkEmailIsRegistered) {
            let Decrypt = await new bcrypt.compare(body.password, checkEmailIsRegistered.password)
            if (Decrypt) {
                let tokenPayload = {
                    id: checkEmailIsRegistered.id,
                    emailId: checkEmailIsRegistered.userEmail
                }
                const jwtToken = jsonwebtoken.sign(tokenPayload, jwt.jwtSecretKey, { expiresIn: '30s' });
                let responsePayload = {
                    userId: checkEmailIsRegistered._id,
                    tokenId: jwtToken
                }
                return res
                .status(StatusCodes.OK)
                .send(successFormat(
                    responsePayload,
                    'login',
                    StatusCodes.OK,
                    `logged in successfully, Welcome ${checkEmailIsRegistered.userName}`))
            }
            else throw new Error('credential not matched')
        }
        else throw new Error('Emailid not registered with records, signup first')
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signin', StatusCodes.BAD_REQUEST))
    }
}

exports.signout = async (req, res) => {
    try {
        const { token } = req.headers
        if (!checkTokenIsBlacListed(token)) {
            let isTokenExpired = checkTokenExpiry(token)
            if (isTokenExpired) return res.send(errorMsgFormat("Token already expired", "signout", StatusCodes.BAD_REQUEST))
            else addBlackListedToken(token)
            return res.send(successFormat({ tokenStatus: "Not expired" }, "signout", StatusCodes.OK, "You have Successfully Logged Out From This Site"))
        }
        return res.send(errorMsgFormat("Invalid Token", "signout", StatusCodes.BAD_REQUEST))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signout', StatusCodes.BAD_REQUEST))
    }
}