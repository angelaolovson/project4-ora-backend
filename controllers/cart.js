////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Product = require("../models/product");
const Cart = require("../models/cart")
const User = require("../models/user");
const jwt = require('jsonwebtoken');
require("dotenv").config();
///////////////////////////////

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();
// ROUTES
////////////////////////////////

// CART INDEX ROUTE
router.get("/", async (req, res) => {
  // Get all carts
  let carts;
  try {
    carts = await Cart.find(req.query)
    res.status(200).json(carts)
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// GET by id
router.get("/:id", async (req, res) => {
    console.log("*******reach get cart by id********")
    try {
        const cart = await Cart.findById(req.params.id)
            // .populate('items.product')
        console.log(cart)
        //     .exec(function (err, cart) {
        //         if (err) return handleError(err);
        //         console.log('The cart is %s', cart);
        // });
        res.status(200).json(cart);
        } catch (error) {
        res.status(400).json(error);
        }
});


// Cart UPDATE ROUTE
router.patch("/:id", async (req, res) => {
    console.log("hellooooo")
    console.log(req.body)
    console.log(req.params.id)
    
    try {
        // Find the cart
        const cart = await Cart.findById(req.params.id);
        // console.log(cart.items[2].product.toString() === req.body.product)
        console.log(req.body.product)

        // Check if the product is already in the items array
        const item = cart.items.find(p => p.product.toString() == req.body.product);

        if (item) {
            // If the product is already in the items array, increase the quantity
            item.quantity += req.body.quantity;
        } else {
            // If the product is not in the items array, add it
            cart.items.push(req.body);
        }

        // Save the cart
        const updatedCart = await cart.save();

        // fetch it again to get the data display right
        const realCart = await Cart.findById(updatedCart._id)

        // send data
        res.status(200).json(realCart);
        console.log(realCart)
    } catch (error) {
        res.status(400).json(error);
        console.log(error)
    }
});


// Find cart by cartId and remove the item from the cart items array that matches the itemId
router.patch("/:cartId/items/:productId", async (req, res) => {
    console.log("hellooooo")
    console.log(req.params.cartId)
    console.log(req.params.productId)
    
    try {
        const updateCart = {
            $pull: {
                items: { product: req.params.productId }
            }
        };
        console.log(updateCart)
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cartId, updateCart, { new: true })
        res.status(200).json(updatedCart);
        console.log(updatedCart)
    } catch (error) {
        res.status(400).json(error);
        console.log(error)
    }
});

module.exports = router;