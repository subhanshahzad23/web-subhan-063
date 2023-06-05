const express = require("express");
let router = express.Router();
let Deal = require("../models/Deal");

router.get("/deals/cart", async (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  let deals = await Deal.find({ _id: { $in: cart } });
  let total = 0;
  for (let index = 0; index < deals.length; index++) {
    total += deals[index].price;
  }
  return res.render("cart", { deals, total });
});
router.get("/deals/remove-from-cart/:id", (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  let index = cart.find((c) => c == req.params.id);
  cart.splice(index, 1);

  res.cookie("cart", cart);
  return res.redirect("back");
});
router.get("/deals/add-to-cart/:id", (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("back");
});
router.get("/deals", async (req, res) => {
  let deals = await Deal.find();
    // return res.send(deals);
  res.render("deals/index", {
    deals,
    pageTitle: "Top Deals Set From Router",
  });
});

router.post("/deals", async (req, res) => {
  try {
    const { title, capacity, size } = req.body;

    // Create a new luggage instance
    const newDeal = new Deal({
      title,
      capacity,
      size,
    });

    // Save the new luggage to the database
    await newDeal.save();

    return res.redirect("/deals")
  } catch (error) {
    console.error("Error creating luggage:", error);
    return res.status(500).json({ message: "Failed to create luggage" });
  }
});


router.post('/deals/delete', async (req, res) => {
  try {
    const { title } = req.body;

    // Delete the deal
    await Deal.findOneAndDelete({ title });

    // Fetch updated list of deals
    const deals = await Deal.find({});

    // Render the deals page
    return res.render("deals/index", {
      deals,
      pageTitle: "Top Luggages Set From Router",
    });

  } catch (error) {
    console.error("Error deleting deal:", error);
    return res.status(500).json({ message: "Failed to delete luggage" });
  }
});

module.exports = router;
