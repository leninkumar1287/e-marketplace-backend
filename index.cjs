require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connectDb } = require('./src/services/connectDB.service.cjs');
const { server } = require('./src/services/config.service.cjs');
const application = express()
application.listen(1234)

try {
    connectDb()
    .then((response) => {
        if(response == 1) {
        console.log("DB connected Successfully")
        application.listen(server.portNumber, () => console.log(`Server Running on PORT : ${server.portNumber}`))}
    })
    .catch(console.dir);
} catch (error) {
    console.log("Error : ", error.message)
}