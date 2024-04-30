require('dotenv').config();
const express = require('express');
const { server } = require('./src/services/config.service.cjs');
const { successFormat } = require('./src/services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const router = require('./src/routes/index.cjs');
const expressEndpoints = require('express-list-endpoints');
const mongoose = require('mongoose');
const sendOTPVerification = require('./src/services/helper/otpSender.cjs')


const application = express()
application.use(express.json())
try {
    //Invoking the DB Connection
    mongoose.connect('mongodb://127.0.0.1:27017/test')
        .then((response) => {
            // console.log("response",response.connection.port)
            if (response.connection) {
                console.log(
                    "*************************************************************************************** \
            \nDB connection Status : ",
                    successFormat(
                        {
                            database: response.connection.name,
                            port: response.connection.port,
                            connectionString: response.connection._connectionString,

                        }
                        , "DB Connection",
                        StatusCodes.ACCEPTED,
                        "DB Connected Successfully"))
                //Running Express Server
                application.listen(server.portNumber, () => {
                    console.log(
                        "*************************************************************************************** \
            \nServer connection Status : ",
                        successFormat(
                            { PortNumber: server.portNumber },
                            "Server Connection",
                            StatusCodes.ACCEPTED,
                            "Server Connected Successfully")
                    )
                    console.log("\t\t\t\tAvailable Endpoint's")
                    const routes = expressEndpoints(application);
                    console.table(routes);
                    // sendOTPVerification()
                })
            }
        })
        .catch(console.dir);
} catch (error) {
    console.log("Error : ", error.message)
}


// Endpoint Router
application.use('/api/v1/e-marketplace', (err, req, res, next) => {
    next()
}, router)