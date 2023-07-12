const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
        type: [
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
        default: [] // Set default to an empty array
      }
});


// // pre-hooks to populate the product
// cartSchema.pre(["findOne","find"],function(next){
//     this.populate("items");
//     next();
// })


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;