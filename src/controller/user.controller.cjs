const UserModel = require('../model/userModel.cjs');
const { successFormat, errorMsgFormat } = require('../services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');
// const { jwt, addBlackListedToken, checkTokenIsBlacListed } = require('../services/config.service.cjs');
// const { checkTokenExpiry } = require('../services/helper/jwtCheckTokenExpiry.helper.cjs');

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
        let checkEmailIsRegistered = await userModel.findOne({ emailId: request.emailId })
        if (checkEmailIsRegistered) {
            //Decrypt the password 
            let Decrypt = await new bcrypt.compare(request.password, checkEmailIsRegistered.password)
            if (Decrypt) {
                let tokenPayload = {
                    id: checkEmailIsRegistered.id,
                    emailId: checkEmailIsRegistered.emailId
                }
                let jwtToken = await jsonwebtoken.sign(tokenPayload, "secret")

                let responsePayload = {
                    userId: checkEmailIsRegistered.id,
                    tokenId: jwtToken
                }
                //If Token exists, Delete the previous one, and lets create a new one
                let checkTokenExists = await jwtTokenModel.findOne({ userId: checkEmailIsRegistered._id })
                if (checkTokenExists)
                    await jwtTokenModel.findOneAndUpdate({ userId: checkEmailIsRegistered.id, tokenId: responsePayload.tokenId })
                else
                    await jwtTokenModel(responsePayload).save()
                return res.status(StatusCodes.OK).send(successFormat(
                    responsePayload,
                    'login',
                    StatusCodes.OK,
                    `logged in successfully, Welcome ${checkEmailIsRegistered.firstName} ${checkEmailIsRegistered.lastName}`))
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
        //Delete the  Jwt token for log out
        let logout = await jwtTokenModel.deleteMany({ tokenId: req.headers.authtoken })
        if (logout.deletedCount > 0)
            return res.status(StatusCodes.OK).send(successFormat('logged out successfully', 'signout', StatusCodes.OK, " Bubye "))
        else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(successFormat('No user logged in this id', 'logout', StatusCodes.INTERNAL_SERVER_ERROR, " No Data Found "))
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signout', StatusCodes.BAD_REQUEST))
    }
}

exports.dashboard = async (req, res) => {
    try {
        let loggedUserDetails = await jwtVerify.verify(req, 'secret')
        let getSignedUser = await userModel.findById({ _id: loggedUserDetails.id })
        if (!getSignedUser)
            throw new Error(' token Not Found')
        let responsePayload = {
            name: getSignedUser.firstName + " " + getSignedUser.lastName,
            EmailId: getSignedUser.emailId,
            profilePhoto: {
                fileUrl: getSignedUser.profilePhoto.filePath
            }
        }
        return res.status(StatusCodes.OK).send(successFormat(responsePayload, 'dashboard', StatusCodes.OK, "Welcome "))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'dashboard', StatusCodes.BAD_REQUEST))
    }
}