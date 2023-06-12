const express = require("express");
const bcrypt = require("bcryptjs");
let router = express.Router();
let User = require("../models/User");
let Deal = require("../models/Deal");

let sessionAuth = require("../middlewares/sessionAuth");
let admin = require("../middlewares/admin");

router.get("/login", (req, res) => {
  res.render("auth/login", {});
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  req.setFlash("danger", "Logged out!");
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.setFlash("danger", "User with this email not present");
    return res.redirect("/login");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.setFlash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.setFlash("danger", "Invalid Password");
    return res.redirect("/login");
  }
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  let userObj = req.body;

  let existingUser = await User.findOne({ email: userObj.email });
  if (existingUser) {
    req.setFlash("danger", "User with this email already exists");
    return res.redirect("/register");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(userObj.password, salt);
  userObj.password = hashed;

  let user = new User(userObj);
  await user.save();
  res.redirect("/login");
});

router.get("/profile", sessionAuth, async (req, res) => {
  res.render("auth/profile");
});

router.get("/admin-profile", sessionAuth, admin, async (req, res, next) => {
  let deals = await Deal.find();

  res.render("auth/admin-profile");
});

module.exports = router;
