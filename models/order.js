const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
    },
    qty:{
        type: String,
        index: true,
    },
    totalPrice: {
        type: Number,
        index: true,
    },
    placedAt: {
        type: Date,
        default: Date.now,
    }
})


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;