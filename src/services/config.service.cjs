require('dotenv').config()

exports.dbCredentials = {
    userName    :   process.env.DBUSERNAME,
    password    :   process.env.DBPASSWORD,
    appName     :   process.env.APPNAME
}

exports.database = {
    databaseName            :   process.env.DATABASENAME,
    collectionName          :   process.env.COLLECTIONNAME
}

exports.server = {
    portNumber  :   process.env.SERVER_PORT || 5000
}