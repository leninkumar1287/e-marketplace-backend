const UserModel = require('../model/userModel.cjs');
const { insertOne} = require('../services/mongodb.service.cjs');
const { successFormat, errorMsgFormat } = require('../services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');

exports.registration = async ( request, response ) => { 
    try {
        const body = request.body;
        let responsePayload = await insertOne(body)
        return response.send(successFormat(responsePayload, "Registration", code = StatusCodes.OK, message = "Registration Successfull")) 
    } catch (error) {
        return response.send(errorMsgFormat(error.message, "Registration",StatusCodes.BAD_REQUEST))
    }
}