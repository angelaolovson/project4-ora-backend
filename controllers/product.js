////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Product = require("../models/product");
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
      res.status(200).json({product}); // need to be in {}?
    } catch (error) {
      res.status(400).json(error);
    }
});


// PRODUCT CREATE ROUTE
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create({
        title: req.body.title,
        price: req.body.price,
        images: req.body.images,
        description: req.body.description,
        ingredients: req.body.ingredients,
        color: req.body.color,
        scents: req.body.scents,
        category: req.body.category,
        subCategory: req.body.subCategory,
        inventoryCount: req.body.inventoryCount
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
    console.log(updateProduct)
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateProduct, { new: true })
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
    res.json(await Product.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

module.exports = router;