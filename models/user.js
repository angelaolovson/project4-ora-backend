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
    role: { 
        type: String, 
        default: 'customer' 
    }, // 'admin'
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
    }],
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }],
});

// pre-hooks to populate the product
userSchema.pre(["findOne","find"],function(next){
    this.populate("cart");
    next();
})


const User = mongoose.model('User', userSchema);
module.exports = User;