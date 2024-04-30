const joiValidation = require('../services/helper/joiValidation.helper.cjs')
const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../services/utils/messageFormatter.cjs')
const { registration, signin, signout, changePassword, deleteProfile, sendOtp, resetPassword, resendOtp } = require('../controller/user.controller.cjs')

exports.signup = async (req, res) => {
    try {
        let { error } = joiValidation.signup(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'registration',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return registration(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'registration',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.signin = async (req, res) => {
    try {
        let { error } = joiValidation.signin(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'signin',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return signin(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signin',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.signOut = (req, res) => {
    try {
        return signout(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signout',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.changePwd = async (req, res) => {
    try {
        let { error } = joiValidation.changePassword(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'Change Password',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return changePassword(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'Change Password',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.sendOtp = (req, res) => {
    try {
        let { error } = joiValidation.sendOtp(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'Send OTP',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return sendOtp(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'Send OTP',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.reSendOtp = (req, res) => {
    try {
        let { error } = joiValidation.reSendOtp(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'Send OTP',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return resendOtp(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'Send OTP',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.resetPassword = (req, res) => {
    try {
        console.log("req :",req.body)
        let { error } = joiValidation.resetPassword(req.body)
        console.log("error : ",error)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'Reset Password',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return resetPassword(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'Reset Password',
                StatusCodes.BAD_REQUEST
            ))
    }
}


exports.deleteUser = async (req, res) => {
    try {
        let { error } = joiValidation.deleteUserProfile(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'Delete Profile',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return deleteProfile(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'Delete Profile',
                StatusCodes.BAD_REQUEST
            ))
    }
}