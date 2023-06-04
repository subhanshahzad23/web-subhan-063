const express = require("express")
let router=express.Router();


const validateProduct = require("../../middlewares/validateProduct");
var { Product } = require("../../models/product");


//for all product
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await Product.find().skip(skipRecords).limit(perPage);
  return res.send(products);
});

//for single product
router.get("/:id",async (req,res)=>{
    try {
        let products = await Product.findById(req.params.id);
        if(!products) return res.status(400).send("Product with given id is")
        return res.send(products)
    } catch (error) {
        return res.status(400).send("Invalid Id")
    }
});


router.post("/", validateProduct,async (req, res) => {
    try {
      const { name, price} = req.body;
      const product = new Product({
        name,
        price,
      });
      await product.save();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });


  router.delete("/:id", async (req, res) => {
    try {
      const productId = req.params.id;
  
      // Find the product by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).send("Product not found");
      }
  
      res.status(200).send("Product deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });


  
  
  router.put("/:id",validateProduct, async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, price } = req.body; // Assuming the request body contains the updated "name" and "price" fields
  
      // Find the product by ID and update it
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name: name, price: price },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).send("Product not found");
      }
  
      res.status(200).send(updatedProduct);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
module.exports = router;
