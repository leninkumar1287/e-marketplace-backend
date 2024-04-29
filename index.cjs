require('dotenv').config();
const express = require('express');
const { connectDb } = require('./src/services/connectDB.service.cjs');
const { server } = require('./src/services/config.service.cjs');
const { successFormat } = require('./src/services/utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');
const router = require('./src/routes/index.cjs');
const expressEndpoints = require('express-list-endpoints')


const application = express()
application.use(express.json())
try {
    //Invoking the DB Connection
    connectDb()
        .then((response) => {
            if (response == 1) {
                console.log(
                    "*************************************************************************************** \
            \nDB connection Status : ",
                    successFormat(
                        response, "DB Connection",
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