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
    const { cart, receiver } = req.body;

    // Create a new order with the provided cart and receiver information
    const newOrder = await Order.create({
      user: cart.user,
      cart: [cart._id], // Wrap the cart ID in an array since it's a reference to an array of carts
      receiver: {
        firstName: receiver.firstName,
        lastName: receiver.lastName,
        phoneNumber: receiver.phoneNumber,
        email: receiver.email,
      },
  });

      // // Update the inventoryCount of products and empty the cart
      // const productIds = cart.items.map((item) => item.product)

      // await Product.updateMany(
      //   { _id: { $in: productIds } },
      //   { $inc: { inventoryCount: -1 } }
      // );

      // await Cart.findByIdAndUpdate(cart._id, { items: [] });

    // Return the newly created cart in the response
    res.status(200).json({cart: newOrder});
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
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