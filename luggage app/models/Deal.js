const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
  title: String,
  capacity: Number,
  size: Number,
});
let Model = mongoose.model("Deal", modelSchema);
module.exports = Model;
