const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;