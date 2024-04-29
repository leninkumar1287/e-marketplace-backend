const joiValidation = require('../services/helper/joiValidation.helper.cjs')
const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../services/utils/messageFormatter.cjs')
const { registration, signin, signout } = require('../controller/user.controller.cjs')

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


