const mongoose = require('mongoose')

const vendorModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    });
const VendorModel = mongoose.model('vendorModel', vendorModel);

module.exports = VendorModel;