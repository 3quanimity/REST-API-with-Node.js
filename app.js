// IMPORTS
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

// connecting to the db using mongoose
// first arg is the path
// /!\ in order to not hard code your password use
// the env variable ' + process.env.MONGO_ATLAS_PW +'
mongoose.connect("mongodb://localhost:27017/academind", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// use morgan before routes (its a middleware)
app.use(morgan("dev"));

//a middleware that allows the conversion to json format of the body of all reqs & res(s)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handeling CORS ERRORS
// appending Headers to allow cross comunication between servers
// disabeling CORS security control / errors
// this should be done before sending any response = before our Routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests (middlewares)
// the first arg is our "filter", second arg is the "handler"
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

//error handeling, after all the declared routes
// handles anything that is not handeled by the above requests (errors)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
