const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
        required: true,
    },
    subCategories: {
        type: String,
        required: true,
    },
    inventoryCount:{
            type: Number,
            required: true,
        },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;