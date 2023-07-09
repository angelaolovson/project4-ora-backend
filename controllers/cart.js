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
  try {
      const cart = await Cart.findById(req.params.id)
      res.status(200).json({cart});
    } catch (error) {
      res.status(400).json(error);
    }
});


// CART CREATE ROUTE
router.post("/", async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Create a new cart with the provided user and items
        const newCart = await Cart.create({
            user: userId,
            items: items,
        });

    // Return the newly created cart in the response
    res.status(200).json({cart: newCart});
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
});

  
// PRODUCT UPDATE ROUTE
router.put("/:id", async (req, res) => {
  try {
    const updateProduct = {
        ...req.body,
    };
    console.log(updateProduct)
    const updatedProduct = await Cart.findByIdAndUpdate(req.params.id, updateProduct, { new: true })
    res.status(200).json(updatedProduct);
    console.log(updatedProduct)
  } catch (error) {
    res.status(400).json(error);
    console.log(error)
  }
});

  
// PRODUCT DELETE ROUTE
router.delete("/:id", async (req, res) => {
  try {
    res.json(await Cart.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

module.exports = router;