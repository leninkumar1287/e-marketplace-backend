const joiValidation = require('../services/helper/joiValidation.helper.cjs')
const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../services/utils/messageFormatter.cjs')
const { registration } = require('../controller/user.controller.cjs')

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