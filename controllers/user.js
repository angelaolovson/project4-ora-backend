const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const {SALT,SECRET} = process.env;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');


let failedLogin;

// PRODUCT INDEX ROUTE
router.get("/", async (req, res) => {
    // Get all users
    let users;
    try {
      users = await User.find(req.query)
      res.status(200).json(users)
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

//login post route
router.post('/login', async(req, res, next) => {
    try {
        let user;
        //find user exist
        const userExists = await User.exists({email: req.body.email});
        //console.log(userExists)
        
        //if exists, find the one in mongodb
        if(userExists) {
            user = await User.findOne({email: req.body.email});
        } else {
            failedLogin = "❌❌User🙅‍♀️🙅‍♂️ doesn't 🕳️ exist❕❌❌"
            return res.status(401).json({error: failedLogin });
        }
        //if user match, compare password
        const match = await bcrypt.compare(req.body.password, user.password);
        //if password match, then create session
        if(match) {
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.email,
                },
                SECRET
            );
            req.session.currentUser = {
                id: user._id,
                username: user.email,
                cart: user.cart
            };
            
           res.json({token, currentUser: req.session.currentUser})
        } else {
            failedLogin = "Your email or password didn't match"
            res.status(401).json({ error: failedLogin });
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

//sign up route

router.get('/signup', (req, res) => {
    res.send("sign up");
});

router.post('/signup', async(req, res, next) => {
    try {
        //creat user and rounds of salt
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
          };
        //create hash on user password depends on SALT number
        const rounds = SALT;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        const hash = await bcrypt.hash(userData.password, salt);

        userData.password = hash;
        
        //if user not already exist, create user
        const existUser = await User.findOne({email: userData.email});
        if(existUser){
             res.status(400).json({error: 'Email already exists'})
        } else {
            const newUser = await User.create(userData);
            console.log(newUser)
            const newCart = {
                user: newUser._id
            }
            console.log(newCart)
            const cart = await Cart.create(newCart)
            console.log(cart)
            newUser.cart.push(cart._id)
            await newUser.save()
            console.log(newUser);
            // console.log(cart.populate("user"))
            res.status(200).json({ message: 'User created successfully', user:newUser });
        }
    } catch(err) {
        console.log(err);
        next();
    }
})


//logout page
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Server error' });
      } else {
        res.clearCookie('token'); // Clear the token cookie
        res.json({ message: 'Logout successful' });
      }
    });
  });

//user and host profile page
router.get('/:id', async(req, res, next) => {
    try{
        let userId = req.params.id;

        const user = await User.findById(userId)
        .populate('orders')

        res.json(user)
    }catch (err){
        console.log(err);
    }
})

//update user
router.put("/:id", async (req, res) => {
try {
    const profileContent = {
        ...req.body
    }
    res.json(
        await User.findByIdAndUpdate(req.params.id,profileContent, { new: true })
    );
    } catch (error) {
    //send error
    console.log(error)
    res.status(400).json(error);
    }
});

// USER DELETE ROUTE
router.delete("/:id", async (req, res) => {
    try {
      res.json(await User.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
});

module.exports = router;