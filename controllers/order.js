////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart")
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
  console.log(req.body, "req.body")
  try {
    const { user, cart, receiver } = req.body;

    // cart findbyid, and clone it to save it as a new array(ex numbers = [1, 2, 3]; numbersCopy = [...numbers]) to avoid losing data after the order placed and cart gets empty;
    const cartInfo = await Cart.findById(cart).populate("items.product");
    console.log(cartInfo)
    const cartInfoCopy = [...cartInfo.items]
    console.log(cartInfoCopy, "*******************   the copy of shopping cart   *******************")

    // Create a new order with the provided cart and receiver information
    const newOrder = await Order.create({
      user: user,
      items: cartInfoCopy, // has product id + qty
      receiver: {
        firstName: receiver.firstName,
        lastName: receiver.lastName,
        phoneNumber: receiver.phoneNumber,
        email: receiver.email,
      },
    });

    // Update the product's orders array with the newly created order ID
    for (const item of cartInfoCopy) {
      const product = await Product.findById(item.product);
      product.orders.push(newOrder._id);
      // Subtract the quantity from inventoryCount
      product.inventoryCount -= item.quantity; 
      await product.save();
    }

    // Empty the cart
    await Cart.findByIdAndUpdate(cart, { items: [] });

    // Update the user's orders array with the newly created order ID
    await User.findByIdAndUpdate(user, { $push: { orders: newOrder._id } });

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