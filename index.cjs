require('dotenv').config();
const express = require('express');
const { connectDb } = require('./src/services/connectDB.service.cjs');
const { server } = require('./src/services/config.service.cjs');
const { successFormat } = require('./src/services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const application = express()
application.listen(1234)

try {
    connectDb()
    .then((response) => {
        if(response == 1) {
        console.log(
            "*************************************************************************************** \
            \nDB connection Status : ",
            successFormat(
                response,"DB Connection",
                StatusCodes.ACCEPTED,
                "DB Connected Successfully"))
        application.listen(server.portNumber, () => console.log(
            "*************************************************************************************** \
            \nServer connection Status : ",
            successFormat(
                {PortNumber : server.portNumber},
                "Server Connection",
                StatusCodes.ACCEPTED,
                "Server Connected Successfully")
                ))
            }
    })
    .catch(console.dir);
} catch (error) {
    console.log("Error : ", error.message)
}