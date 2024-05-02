const UserModel = require("../../model/userModel.cjs");
const { jwt } = require("../config.service.cjs");
const jsonwebtoken = require('jsonwebtoken')

exports.getUserFromToken = async (token) => {
    let getUser = jsonwebtoken.verify(token, jwt.jwtSecretKey)
        let getProfile = await UserModel.findOne({ userEmail: getUser.userEmail })
        getProfile = getProfile.toObject();
        return getProfile
}