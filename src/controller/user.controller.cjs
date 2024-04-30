const UserModel = require('../model/userModel.cjs');
const { successFormat, errorMsgFormat } = require('../services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');
const { validateObjectId } = require('../services/helper/objectIdValidation.helper.cjs');
const { jwt, addBlackListedToken, checkTokenIsBlacListed } = require('../services/config.service.cjs');
const { checkTokenExpiry } = require('../services/helper/jwtCheckTokenExpiry.helper.cjs');

exports.registration = async (req, res) => {
    try {
        let request = req.body
        //check the user is exit or not 
        let checkUserIsExistBymail = await UserModel.findOne({ userEmail: request.userEmail })
        let checkUserIsExistUserName = await UserModel.findOne({ userName: request.userName })

        if (checkUserIsExistUserName) {
            if (checkUserIsExistUserName.userName === request.userName) {
                throw new Error('User Name already taken by someone, try with another User Name')
            }
        }
        if (checkUserIsExistBymail) {
            if (checkUserIsExistBymail.userEmail === request.userEmail) {
                throw new Error('EmailId already registered, try with another email')
            }
        }
        else {
            //encrypt the password 
            let encryptPassword = await new bcrypt.hash(request.password, 10)
            //insert the data in DB
            request.password = encryptPassword;
            await UserModel(request).save()
            // destruct data for response
            let responsePayload = {
                Name: request.userName,
                Email: request.userEmail
            }
            return res.status(StatusCodes.CREATED).send(successFormat(responsePayload, 'signup', StatusCodes.CREATED, 'registration successfully completed'))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
}

exports.signin = async (req, res) => {
    try {
        let request = req.body
        let checkEmailIsRegistered = await UserModel.findOne({ userEmail: request.emailId })
        console.log("checkEmailIsRegistered :", checkEmailIsRegistered)
        if (checkEmailIsRegistered) {
            //Decrypt the password 
            let Decrypt = await new bcrypt.compare(request.password, checkEmailIsRegistered.password)
            if (Decrypt) {
                let tokenPayload = {
                    id: checkEmailIsRegistered.id,
                    emailId: checkEmailIsRegistered.emailId
                }
                const jwtToken = jsonwebtoken.sign(tokenPayload, jwt.jwtSecretKey, { expiresIn: '30s' });

                let responsePayload = {
                    userId: checkEmailIsRegistered.id,
                    tokenId: jwtToken
                }
                //If Token exists, Delete the previous one, and lets create a new one

                return res.status(StatusCodes.OK).send(successFormat(
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

exports.deleteProfile = async (request, response) => {
    try {
        const requestBody = request.body
        let objectIdValidation = validateObjectId(requestBody.objectId)
        if (objectIdValidation.error === false) {
            let deleteUser = await UserModel.findByIdAndDelete({ _id: requestBody.objectId })
            if (deleteUser === null)
                return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: `User Profile Not Found` }, 'Delete User', StatusCodes.NOT_FOUND))
            else return response.status(StatusCodes.OK).send(successFormat(deleteUser, "Delete Profile", StatusCodes.OK, `${deleteUser.userName} User profile deleted successfully`))
        }
        else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat(objectIdValidation, 'Delete User', StatusCodes.NOT_FOUND))
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, "Delete Profile", StatusCodes.BAD_REQUEST))
    }
}