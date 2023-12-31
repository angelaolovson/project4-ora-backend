const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
            },
            quantity: {
              type: Number,
            },
          },
        ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    receiver: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
});

// pre-hooks to populate the product
orderSchema.pre(["findOne","find"],function(next){
    this.populate("items.product");
    next();
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
