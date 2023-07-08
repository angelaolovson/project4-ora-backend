////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
///////////////////////////////

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

// ROUTES
////////////////////////////////

// ORDER INDEX ROUTE
router.get("/", async (req, res) => {
  try {
    // send all Order
    res.json(await Order.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    res.json(await Order.findById(req.params.id)).status(200);
  } catch (error) {
    res.status(400).json(error);
    console.log("error", error);
  } finally {
    console.log("this is finally");
  }
});
  
// ORDER CREATE ROUTE
router.post("/", async (req, res) => {
});
  
// ORDER UPDATE ROUTE
router.put("/:id", async (req, res) => {

});

// ORDER DELETE ROUTE
router.delete("/:id", async (req, res) => {
  try {
    // send all people
    res.json(await Order.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

module.exports = router;