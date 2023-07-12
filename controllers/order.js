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
  console.log(req.body)
    try {
        // const { userId, items } = req.body;
        const cart = req.body.cart
        console.log(cart)
        // Create a new cart with the provided user and items
        const newOrder = await Order.create({
            cart: cart
        });
    
      // Update the inventoryCount of products and empty the cart
      const productIds = cart.items.map((item) => item.product)
      
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $inc: { inventoryCount: -1 } }
      );

      await Cart.findByIdAndUpdate(cart._id, { items: [] });

    // Return the newly created cart in the response
    res.status(200).json({cart: newOrder});
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
});
  
// ORDER UPDATE ROUTE
router.put("/:id", async (req, res) => {

});

// ORDER DELETE ROUTE
router.delete("/:id", async (req, res) => {
  try {
    res.json(await Order.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

module.exports = router;