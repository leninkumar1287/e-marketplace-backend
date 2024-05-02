const UserModel = require('../model/userModel.cjs');
const OtpModel = require('../model/otpModel.cjs')
const { successFormat, errorMsgFormat } = require('../services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');
const { validateObjectId } = require('../services/helper/objectIdValidation.helper.cjs');
const { jwt, addBlackListedToken, checkTokenIsBlacListed } = require('../services/config.service.cjs');
const { checkTokenExpiry } = require('../services/helper/jwtCheckTokenExpiry.helper.cjs');
const { sendOtpForVerification, welcomeMail, resetPwdMailer, profileUpdateMailer } = require('../services/helper/otpSender.cjs');
const { resetPasswordOTPverifier, profileUpdateOTPverifier } = require('../services/helper/otpVerifier.cjs');
const { getUserFromToken } = require('../services/helper/getUserFromToken.helper.cjs');

exports.registration = async (req, res) => {
    try {
        let request = req.body
        //check the user is exit or not 
        let checkingDuplicate = await UserModel.findOne({ userEmail: request.userEmail })

        if (checkingDuplicate) {
            if (checkingDuplicate.userName === request.userName) {
                throw new Error('User Name already taken by someone, try with another User Name')
            }
            else if (checkingDuplicate.userEmail === request.userEmail) {
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
            await welcomeMail({ userName: request.userName, userEmail: request.userEmail })
            return res.status(StatusCodes.CREATED).send(successFormat(responsePayload, 'signup', StatusCodes.CREATED, 'registration successfully completed'))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
}

exports.signin = async (req, res) => {
    try {
        let request = req.body
        let checkEmailIsRegistered = await UserModel.findOne({ userEmail: request.userEmail })
        if (checkEmailIsRegistered) {
            //Decrypt the password 
            let Decrypt = await new bcrypt.compare(request.password, checkEmailIsRegistered.password)
            if (Decrypt) {
                let tokenPayload = {
                    id: checkEmailIsRegistered.id,
                    userEmail: checkEmailIsRegistered.userEmail
                }
                const jwtToken = jsonwebtoken.sign(tokenPayload, jwt.jwtSecretKey, { expiresIn: '30h' });

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
            let user = await getUserFromToken(token)
            return res.send(successFormat({ tokenStatus: `User ${user.userName} logged Out` }, "signout", StatusCodes.OK, "You have Successfully Logged Out From This Site"))
        }
        return res.send(errorMsgFormat("Invalid Token", "signout", StatusCodes.BAD_REQUEST))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'signout', StatusCodes.BAD_REQUEST))
    }
}

exports.viewProfile = async (request, response) => {
    try {
        const { token } = request.headers
        let user = await getUserFromToken(token)
        if (user.hasOwnProperty('__v')) {
            delete user.__v;
            delete user.password
        }
        if (user) {
            return response.status(StatusCodes.OK).send(successFormat(user, "View Profile", StatusCodes.OK, `Profile Fetched Successfully ! Welcome ${user.userName}`))
        }
        else return response.status(StatusCodes.OK).send(errorMsgFormat({ message: "Invalid Login, User not found from your token" }, "View Profile", StatusCodes.OK))
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat({ message: error.message }, "View Profile", StatusCodes.BAD_REQUEST))
    }
}

exports.updateProfile = async (request, response) => {
    try {
        const { token } = request.headers
        const requestBody = request.body
        if (!checkTokenIsBlacListed(token)) {
            let isTokenExpired = checkTokenExpiry(token)
            if (isTokenExpired) return res.send(errorMsgFormat("Token already expired", "Update Profile", StatusCodes.BAD_REQUEST))
            else {
                let checkUserAvailable = await UserModel.findOne({ userEmail: requestBody.userEmail })
                if (checkUserAvailable) {
                    let otpVerifier = await profileUpdateOTPverifier(requestBody)
                    if (otpVerifier.errors === false) {
                        const updateFields = {}; // Initialize an empty object to store update fields
                        // Iterate over each key in the update object
                        for (const key in requestBody.update) {
                            // Check if the key is present and not empty
                            if (requestBody.update.hasOwnProperty(key) && requestBody.update[key] !== '') {
                                // Add the key-value pair to the updateFields object
                                updateFields[key] = requestBody.update[key];
                            }
                        }
                        const updateProfile = await UserModel.updateOne({ userEmail: requestBody.userEmail }, { $set: updateFields })
                        console.log("updateProfile :", updateProfile)
                        if (updateProfile) {
                            // const updateProfile = await UserModel.updateOne({ userEmail: requestBody.userEmail }, { password: encryptedNewPassword })
                            if (updateProfile.acknowledged && updateProfile.modifiedCount && updateProfile.matchedCount) {
                                const mailPayload = {
                                    userName: checkUserAvailable.userName,
                                    userEmail: checkUserAvailable.userEmail,
                                    message: "Profile successfully updated."
                                }
                                await profileUpdateMailer(mailPayload)
                                await OtpModel.findOneAndDelete({ userEmail: checkUserAvailable.userEmail })
                                return response.status(StatusCodes.CREATED).send(successFormat(true, "Update profile", StatusCodes.CREATED, "Profile Updated Successfully"))
                            }
                            else return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat({ message: "Profile update not succesffull" }, 'Update profile', StatusCodes.BAD_REQUEST))
                        }
                        else throw new Error('User not Found')
                    }
                    return response.status(otpVerifier.code).send(otpVerifier)
                }
                else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat("User Not Found", 'Update Profile', StatusCodes.NOT_FOUND))

            }
        }
        return response.send(errorMsgFormat("Invalid Token", "Update Profile", StatusCodes.BAD_REQUEST))
    }
    catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'Update Profile', StatusCodes.BAD_REQUEST))
    }
}

exports.deleteProfile = async (request, response) => {
    try {
        const requestBody = request.body
        const { token } = request.headers
        // let objectIdValidation = validateObjectId(requestBody.objectId)
        // if (true) {

        let findUser = await UserModel.findOne({ userEmail: requestBody.userEmail })
        if (findUser === null) return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: 'User Not Found' }, 'Delete User', StatusCodes.NOT_FOUND))
        if (!checkTokenIsBlacListed(token)) {
            let checkPassword = await bcrypt.compare(requestBody.password, findUser.password)
            if (checkPassword) {
                let deleteUser = await UserModel.deleteOne({ userEmail: requestBody.userEmail })
                addBlackListedToken(token)
                return response.status(StatusCodes.OK).send(successFormat(deleteUser, "Delete Profile", StatusCodes.OK, `${findUser.userName} User profile deleted successfully`))
            }
            else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: `Wrong Password` }, 'Delete User', StatusCodes.NOT_FOUND))
        }
        else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat("Token Invalid", 'Delete User', StatusCodes.NOT_FOUND))
        // }
        // else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat(objectIdValidation, 'Delete User', StatusCodes.NOT_FOUND))
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, "Delete Profile", StatusCodes.BAD_REQUEST))
    }
}

exports.changePassword = async (request, response) => {
    try {
        const requestBody = request.body;
        const { token } = request.headers

        let existingUser = await UserModel.findOne({ userEmail: requestBody.userEmail })
        if (existingUser) {
            if (!checkTokenIsBlacListed(token)) {
                let Decrypt = await new bcrypt.compare(requestBody.oldPassword, existingUser.password)
                let encryptedNewPassword = await bcrypt.hash(requestBody.newPassword, 10);
                if (Decrypt) {
                    let updatePassword = await UserModel.findOneAndUpdate({ userEmail: requestBody.userEmail }, { password: encryptedNewPassword })
                    if (updatePassword) return response.status(StatusCodes.OK).send(successFormat(updatePassword, "Change Password", StatusCodes.OK, "password changed successfully"))
                }
                else return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat("Password Not Matched With Old Password", 'Change password', StatusCodes.BAD_REQUEST))
            }
            else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat("Token Invalid", 'Delete User', StatusCodes.NOT_FOUND))
        }
        else return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat("User Not Found", 'Change password', StatusCodes.BAD_REQUEST))

    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'Change password', StatusCodes.BAD_REQUEST))
    }
}

exports.sendOtp = async (request, response) => {
    try {
        const { userEmail } = request.body
        let checkUserExists = await UserModel.findOne({ userEmail: userEmail })
        if (checkUserExists === null)
            return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: "No user registered with email id" }, "OTP Sender", StatusCodes.NOT_FOUND))
        else {
            let checkExisitingOTP = await OtpModel.findOne({ userEmail: checkUserExists.userEmail })
            if (checkExisitingOTP ? checkExisitingOTP.expiresAt > Date.now() : false)
                return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: "OTP Not Expired. please use the OTP else request after 30 second from your previous try" }, "OTP Sender", StatusCodes.NOT_FOUND))
            else await OtpModel.deleteOne({ userEmail: checkUserExists.userEmail })
            let responsePayLoad = await sendOtpForVerification(checkUserExists)
            if (responsePayLoad.statusOfOTPSent === true) {
                let hashedOTP = await new bcrypt.hash(responsePayLoad.otp.toString(), 10)
                // Destructring OTP model
                const otpVerification = new OtpModel({
                    userEmail: userEmail,
                    otp: hashedOTP,
                    resendAllowdTime: Date.now() + 30000,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 360000
                })
                // Save the OTP records for verification
                await otpVerification.save()
                const { otp, ...payloadWithoutOTP } = responsePayLoad;
                return response.status(StatusCodes.OK).send(successFormat(payloadWithoutOTP, "Resend OTP", StatusCodes.OK, "OTP send successfully"))
            }
        }
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat({ message: error.message }, 'OTP Sender', StatusCodes.BAD_REQUEST))
    }
}

exports.resendOtp = async (request, response) => {
    try {
        const requestBody = request.body
        let checkResendTime = await OtpModel.findOne({ userEmail: requestBody.userEmail })
        if (checkResendTime ? checkResendTime.resendAllowdTime < Date.now() : false) {
            let user = await UserModel.findOne({ userEmail: requestBody.userEmail })
            let checkUserExists = await OtpModel.findOneAndDelete({ userEmail: requestBody.userEmail })
            // checkUserExists.emailAction = UserAction.SENT_OTP;
            checkUserExists.userName = user.userName;
            if (checkUserExists === null) throw new Error("Invalid Request")
            else {
                let otpGenerator = await sendOtpForVerification(checkUserExists)
                if (otpGenerator.statusOfOTPSent === true) {
                    let hashedOTP = await new bcrypt.hash(otpGenerator.otp.toString(), 10)
                    // Destructring OTP model
                    const otpVerification = new OtpModel({
                        userEmail: requestBody.userEmail,
                        otp: hashedOTP,
                        resendAllowdTime: Date.now() + 30000,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 360000
                    })
                    await otpVerification.save()
                    const { otp, ...payloadWithoutOTP } = otpGenerator;
                    return response.status(StatusCodes.OK).send(successFormat(payloadWithoutOTP, "Resend OTP", StatusCodes.OK, "OTP Re send successfully"))
                }
            }
        }
        if (checkResendTime === null) throw new Error("Bad Request")
        return response.status(StatusCodes.METHOD_NOT_ALLOWED)
            .send(errorMsgFormat({ message: "Resent not allowed now, You can request after 30seconds from the previous request" }
                , "Resend OTP",
                StatusCodes.METHOD_NOT_ALLOWED))
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'Resend OTP', StatusCodes.BAD_REQUEST))
    }
}

exports.resetPassword = async (request, response) => {
    try {
        const requestBody = request.body;
        let checkUserAvailable = await UserModel.findOne({ userEmail: requestBody.userEmail })
        if (checkUserAvailable != null) {
            let result = await resetPasswordOTPverifier(requestBody)
            if (result.errors === false) {
                let compareOldPassword = await bcrypt.compare(requestBody.newPassword, checkUserAvailable.password)
                if (!compareOldPassword) {
                    let encryptedNewPassword = await bcrypt.hash(requestBody.newPassword, 10);
                    const updatePassword = await UserModel.updateOne({ userEmail: requestBody.userEmail }, { password: encryptedNewPassword })
                    await OtpModel.findOneAndDelete({ userEmail: checkUserAvailable.userEmail })
                    if (updatePassword.acknowledged && updatePassword.modifiedCount && updatePassword.matchedCount) {
                        const mailPayload = {
                            userName: checkUserAvailable.userName,
                            userEmail: checkUserAvailable.userEmail,
                            message: "Password reset successfully completed."
                        }
                        await resetPwdMailer(mailPayload)
                        return response.status(StatusCodes.CREATED).send(successFormat(true, "Reset Password", StatusCodes.CREATED, "password resetted successfully"))
                    }
                    else return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat({ message: "Password Reset Not Completed" }, 'Reset password', StatusCodes.BAD_REQUEST))
                }
                else return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat({ message: "Found same password, Try with new different password" }, 'Reset password', StatusCodes.BAD_REQUEST))
            }
            else return response.status(result.code).send(result)
        } else return response.status(StatusCodes.NOT_FOUND).send(errorMsgFormat({ message: "User not Registered, Do the Registration first" }, "Reset Password", StatusCodes.NOT_FOUND))
    } catch (error) {
        return response.status(StatusCodes.BAD_REQUEST).send(errorMsgFormat(error.message, 'Reset password', StatusCodes.BAD_REQUEST))
    }
}