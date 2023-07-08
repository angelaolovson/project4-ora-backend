////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Product = require("../models/product");
const axios = require("axios");
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

// PRODUCT INDEX ROUTE
router.get("/", async (req, res) => {
  // Get all products
  let products;
  try {
    products = await Product.find(req.query)
    res.status(200).json(products)
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
      const product = await Product.findById(req.params.id)
      res.status(200).json({product});
    } catch (error) {
      res.status(400).json(error);
    }
});


// PRODUCT CREATE ROUTE
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create({
        title: req.body.title,
    });

    // Return the newly created product in the response
    res.status(200).json({product: newProduct});
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

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateProduct, { new: true })
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
});

  
// PRODUCT DELETE ROUTE
router.delete("/:id", async (req, res) => {
  try {
    res.json(await Product.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

module.exports = router;