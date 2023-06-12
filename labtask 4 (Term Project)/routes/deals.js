const express = require("express");
let router = express.Router();
let Deal = require("../models/Deal");
const sessionAuth = require("../middlewares/sessionAuth");
const admin = require("../middlewares/admin");

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
router.get("/admin-profile",sessionAuth,admin, async (req, res) => {
    let deals = await Deal.find();
      // return res.send(deals);
    res.render("auth/admin-profile", {
      deals,
      pageTitle: "Top Deals Set From Router",
    });
  });

// router.post("/deals", async (req, res) => {
//   try {
//     const { title, price, description } = req.body;

//     // Create a new luggage instance
//     const newDeal = new Deal({
//       title,
//       price,
//       description,
//     });

//     // Save the new luggage to the database
//     await newDeal.save();

//     return res.redirect("/deals")
//   } catch (error) {
//     console.error("Error creating luggage:", error);
//     return res.status(500).json({ message: "Failed to create luggage" });
//   }
// });

router.post('/deals', async (req, res) => {
    try {
      const { title, price, description } = req.body;
  
      // Create a new deal instance
      const newDeal = new Deal({
        title,
        price,
        description
      });
  
      // Save the deal to the database
      const savedDeal = await newDeal.save();
  
      res.redirect('/admin-profile');
    } catch (error) {
      console.error('Error creating deal:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.post('/deals/delete/:id', async (req, res) => {
  try {
    const {title} = req.params;

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

// Assuming you are using Express.js
router.post('/deals/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      const deletedProduct = await Deal.findOneAndDelete({ _id: productId });
  
      if (!deletedProduct) {
        return res.status(404).send('Product not found.');
      }
  
      // Product successfully deleted
      // You can redirect to a different page or send a success message
      return res.redirect('/deals');
    } catch (error) {
      console.error(error);
      return res.status(500).send('An error occurred while deleting the product.');
    }
  });
  
router.post('/deals/delete/admin', async (req, res) => {
    try {
      const { title } = req.body;
  
      // Delete the deal
      await Deal.findOneAndDelete({ title });
  
      // Fetch updated list of deals
      const deals = await Deal.find({});
  
      // Render the deals page
      return res.render("auth/admin-profile", {
        deals,
        pageTitle: "Top Luggages Set From Router",
      });
  
    } catch (error) {
      console.error("Error deleting deal:", error);
      return res.status(500).json({ message: "Failed to delete luggage" });
    }
  });

module.exports = router;
