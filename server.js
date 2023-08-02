///Dependencies 
const express = require ('express');
const app = express ();
require("dotenv").config();
const {PORT,MONGODB_URL,SECRET} = process.env;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("./models/connection");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Product = require('./models/product');
const bodyParser = require('body-parser');

// middleWare

app.use(morgan("dev"));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: MONGODB_URL
        }),
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    })
)

app.use(bodyParser.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: false }));
// app.use(cors());
app.use(cors({
    origin: ['https://capstone-ora-frontend.onrender.com', 'http://localhost:3000'], // Replace with your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }));
  

//router
const userRouter = require("./controllers/user");
const orderRouter = require("./controllers/order");
const productRouter = require("./controllers/product");
const cartRouter = require("./controllers/cart");

//route
app.get("/", async(req,res)=> {
    try {
        // send all products
        res.json(await Product.find({}));
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})

app.use("/user", userRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

//Listener
app.listen(PORT, () => console.log(`listening to PORT ${PORT}`));