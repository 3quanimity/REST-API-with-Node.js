const mongoose = require("mongoose");

// creating the product schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// exporting the schema (wrapped into a model)
module.exports = mongoose.model("Product", productSchema);
