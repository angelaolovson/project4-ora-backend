const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;