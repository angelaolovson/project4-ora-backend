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
            .populate('items.product')
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


// // CART CREATE ROUTE
// router.post("/", async (req, res) => {
//     console.log(req.body)
//     try {
//         // const { userId, items } = req.body;
//         const user = req.body.user
//         const items = req.body.items
//         console.log(items)
//         // Create a new cart with the provided user and items
//         const newCart = await Cart.create({
//             user: user,
//             items: items,
//         });

//     // Return the newly created cart in the response
//     res.status(200).json({cart: newCart});
//   } catch (error) {
//     console.log(error)
//     res.status(400).json(error);
//   }
// });

  
// // Cart UPDATE ROUTE
// router.patch("/:id", async (req, res) => {
//     console.log("hellooooo")
//     console.log(req.body)
//     console.log(req.params.id)
    
//     try {
//         const updateCart = {
//             $push: {
//                 items: req.body
//             }
//         };
//         console.log(updateCart)
//         const updatedCart = await Cart.findByIdAndUpdate(req.params.id, updateCart, { new: true })
//         res.status(200).json(updatedCart);
//         console.log(updatedCart)
//     } catch (error) {
//         res.status(400).json(error);
//         console.log(error)
//     }
// });

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

        // let item;
        // for (let i = 0; i < cart.items.length; i++) {
        //     let p = cart.items[i].product.toString();
        //     console.log(typeof(p))
        //     console.log(typeof(req.body.product))
        //     if ( p == req.body.product) {
        //         item = cart.items[i];
        //         break;
        //     }
        // }

        if (item) {
            // If the product is already in the items array, increase the quantity
            item.quantity += req.body.quantity;
        } else {
            // If the product is not in the items array, add it
            cart.items.push(req.body);
        }

        // Save the cart
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
        console.log(updatedCart)
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



  
// // PRODUCT DELETE ROUTE
// router.delete("/:id", async (req, res) => {
//   try {
//     res.json(await Cart.findByIdAndRemove(req.params.id));
//   } catch (error) {
//     //send error
//     res.status(400).json(error);
//   }
// });

// module.exports = router;



// // DELETE ITEM FROM CART ROUTE
// router.delete("/:id/items/:itemId", async (req, res) => {
//     console.log(req.params.itemId)
//     try {
//         // find the cart by id
//         const cart = await Cart.findById(req.params.id);

//         // find the item index in the cart
//         const itemIndex = cart.items.findIndex(item => item.id == req.params.itemId);

//         if (itemIndex >= 0) {
//             // remove the item from the cart
//             cart.items.splice(itemIndex, 1);

//             // save the cart
//             const updatedCart = await cart.save();

//             // return the updated cart
//             res.status(200).json(updatedCart);
//         } else {
//             res.status(404).json({ message: "Item not found in the cart" });
//         }
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

module.exports = router;