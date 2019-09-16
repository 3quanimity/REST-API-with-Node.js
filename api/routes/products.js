const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//importing the product Schema Model
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      // if docs is empty, we either deleted everything or starting fresh
      // if (docs.length >= 0) {
      res.status(200).json(docs);
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
        message: "Handeling POST requests to /products",
        createdProduct: product
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
    .exec()
    .then(doc => {
      console.log(doc);
      //if the id is valid but it just dosnt exist
      if (doc) {
        res.status(200).json(doc);
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
      console.log(result);
      res.status(200).json(result);
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
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
