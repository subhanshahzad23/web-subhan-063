const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
  title: String,
  price: Number,
  description: String,
});
let Model = mongoose.model("Deal", modelSchema);
module.exports = Model;
