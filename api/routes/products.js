const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//importing the product Schema Model
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id") // fields i want to fetch (no __v:0)
    .exec()
    .then(docs => {
      const response = {
        count: docs.length, // amount of elements fetched
        //array of all the products
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            //optional instructional metadata on how to get more details on each item
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      // if docs is empty, we either deleted everything or starting fresh
      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: "No entries found"
      //   });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  //creating a new instance using the imported Product Model
  const product = new Product({
    // creating a new id using mongoose
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  // ".save" is a mongoose method that stores the object in the db
  // ".exec" turn it into a promess so that we dont have to use a callback func
  // ".then" => promess
  // ".catch" catches errors
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
      console.log(doc);
      //if the id is valid but it just dosnt exist
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http:localhost:3000/products"
          }
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
      // send command should be written in this then block
      // to be sure that the doc was received successfully
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  //checks what data we want to update
  const updateOps = {};
  // looping through all the operations of the req.body ()
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update(
    { _id: id }, // filter
    { $set: updateOps }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: "http://localhost:3000/products/" + id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          body: {
            name: "String",
            price: "Number"
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
