const mongoose = require("mongoose");

// creating the product schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

// exporting the schema (wrapped into a model)
module.exports = mongoose.model("Product", productSchema);
