require('dotenv').config()

exports.dbCredentials = {
    userName: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    appName: process.env.APPNAME
}

exports.database = {
    databaseName: process.env.DATABASENAME,
    collectionName: process.env.COLLECTIONNAME
}

exports.server = {
    portNumber: process.env.SERVER_PORT || 5000
}

exports.jwt = {
    jwtSecretKey: process.env.JWTSECRETKEY,
    twtTokenExpiry: process.env.JWTTOKENEXPIRY
}

const blackListedToken = new Set()

exports.addBlackListedToken = (token) => {
    return blackListedToken.add(token.toString())
}

exports.checkTokenIsBlacListed = (token) => {
    return blackListedToken.has(token.toString())
}

exports.uniqueFields = {
    userName :'',
    userEmail : '',
    mobileNumber: ''
}