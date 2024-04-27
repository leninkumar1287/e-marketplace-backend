const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
      },
      userEmail: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      contactNumber : {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
const user = mongoose.model('User', userModel);

module.exports = user;