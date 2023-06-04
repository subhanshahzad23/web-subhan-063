const express = require ('express');
let app = express ();
var expressLayouts = require ('express-ejs-layouts');
var cookieParser = require ('cookie-parser');
var session = require ('express-session');

app.use(express.static("public"));
app.use(expressLayouts)
app.set ('view engine', 'ejs');

app.get ('/', (req, res) => {
  res.render ('homepage');
});


app.listen(5500, () => {
  console.log("Server Started, Visit localhost:3000");
});

const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.b63lpfg.mongodb.net/", { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));



