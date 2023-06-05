// const express = require("express");
// const Luggage = require("../../models/Luggage");
// let router = express.Router();
// router.post("/api/luggages", async function (req, res) {
//   let record = new Luggage(req.body);
//   await record.save();
//   res.send(record);
// });

// router.put("/api/luggages/:id", async function (req, res) {
//   //   return res.send(req.body);
//   let record = await Luggage.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   res.send(record);
// });
// router.delete("/api/luggages/:id", async function (req, res) {
//   let record = await Luggage.findByIdAndDelete(req.params.id);
//   res.send("Done");
// });
// router.get("/api/luggages/:id", async function (req, res) {
//   let record = await Luggage.findById(req.params.id);
//   res.send(record);
// });
// router.get("/api/luggages", async function (req, res) {
//   let records = await Luggage.find();
//   res.send(records);
// });

// module.exports = router;



// const express = require("express");
// let router = express.Router();
// let Luggage = require("../../models/Luggage");

// router.get("/luggages/cart", async (req, res) => {
//   let cart = req.cookies["cart"];
//   if (!cart) cart = [];
//   let luggages = await Luggage.find({ _id: { $in: cart } });
//   let total = 0;
//   for (let index = 0; index < luggages.length; index++) {
//     total += luggages[index].price;
//   }
//   return res.render("cart", { luggages, total });
// });
// router.get("/luggages/remove-from-cart/:id", (req, res) => {
//   let cart = req.cookies["cart"];
//   if (!cart) cart = [];
//   let index = cart.find((c) => c == req.params.id);
//   cart.splice(index, 1);

//   res.cookie("cart", cart);
//   return res.redirect("back");
// });
// router.get("/luggages/add-to-cart/:id", (req, res) => {
//   let cart = req.cookies["cart"];
//   if (!cart) cart = [];
//   cart.push(req.params.id);
//   res.cookie("cart", cart);
//   return res.redirect("back");
// });
// router.get("/luggages", async (req, res) => {
//   let luggages = await Luggage.find();
//     return res.send(luggages);
//   // res.render("luggages/index", {
//   //   luggages,
//   //   pageTitle: "Top Deals Set From Router",
//   // });
// });

// // ...

// router.post("/", async (req, res) => {
//   try {
//     const { title, capacity, size } = req.body;

//     // Create a new luggage instance
//     const newLuggage = new Luggage({
//       title,
//       capacity,
//       size,
//     });

//     // Save the new luggage to the database
//     await newLuggage.save();

//     return res.status(201).json({ message: "Luggage created successfully" });
//   } catch (error) {
//     console.error("Error creating luggage:", error);
//     return res.status(500).json({ message: "Failed to create luggage" });
//   }
// });

// // ...

// module.exports = router;



const express = require("express");
let router = express.Router();
let Luggage = require("../../models/Luggage");

router.get("/api/luggages/cart", async (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  let luggages = await Luggage.find({ _id: { $in: cart } });
  let total = 0;
  for (let index = 0; index < luggages.length; index++) {
    total += luggages[index].price;
  }
  return res.render("cart", { luggages, total });
});

router.get("/api/luggages/remove-from-cart/:id", (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  let index = cart.indexOf(req.params.id);
  if (index > -1) {
    cart.splice(index, 1);
  }
  res.cookie("cart", cart);
  return res.redirect("back");
});

router.get("/api/luggages/add-to-cart/:id", (req, res) => {
  let cart = req.cookies["cart"];
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("back");
});

router.get("/api/luggages", async (req, res) => {
  let luggages = await Luggage.find();
  // return res.send(luggages);
  res.render("luggages/index", {
    luggages,
    pageTitle: "Top Luggages Set From Router",
  });
});

router.post("/api/luggages", async (req, res) => {
  try {
    const { title, capacity, size } = req.body;

    // Create a new luggage instance
    const newLuggage = new Luggage({
      title,
      capacity,
      size,
    });

    // Save the new luggage to the database
    await newLuggage.save();

    res.render("luggages/index", {
      luggages,
      pageTitle: "Top Luggages Set From Router",
    });
  } catch (error) {
    console.error("Error creating luggage:", error);
    return res.status(500).json({ message: "Failed to create luggage" });
  }
});



router.put("/luggages/:id", async (req, res) => {
  try {
    const { title, capacity, size } = req.body;

    // Find the luggage by ID and update its properties
    const updatedLuggage = await Luggage.findByIdAndUpdate(
      req.params.id,
      {
        title,
        capacity,
        size,
      },
      { new: true }
    );

    if (!updatedLuggage) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    return res.json(updatedLuggage);
  } catch (error) {
    console.error("Error updating luggage:", error);
    return res.status(500).json({ message: "Failed to update luggage" });
  }
});

router.delete("/luggages/:id", async (req, res) => {
  try {
    const deletedLuggage = await Luggage.findByIdAndDelete(req.params.id);

    if (!deletedLuggage) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    return res.json({ message: "Luggage deleted successfully" });
  } catch (error) {
    console.error("Error deleting luggage:", error);
    return res.status(500).json({ message: "Failed to delete luggage" });
  }
});

router.get("/luggages/:id", async (req, res) => {
  try {
    const luggage = await Luggage.findById(req.params.id);

    if (!luggage) {
      return res.status(404).json({ message: "Luggage not found" });
    }

    return res.json(luggage);
  } catch (error) {
    console.error("Error retrieving luggage:", error);
    return res.status(500).json({ message: "Failed to retrieve luggage" });
  }
});

module.exports = router;


