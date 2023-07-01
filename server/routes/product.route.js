const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const {
  createProduct,
  getShopProducts,
  deleteShopProducts,
  getProduct,
  highestSoldProduct,
  getAllProducts,
  getLatestProducts,
  getProducts,
  searchProducts,
  getCategories,
} = require("../controllers/product.controller");
const { upload } = require("../middleware/multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sellerIsAuthenticated } = require("../middleware/auth");

// Create a Shop
router.post(
  "/create-product",
  upload.array("images"),
  [body("name").notEmpty().withMessage("Name is required")],

  catchAsyncErrors(createProduct)
);

// get All shop Product
router.get("/get-all-shop-products/:id", catchAsyncErrors(getShopProducts));

// get single product
router.get("/get-product/:id", catchAsyncErrors(getProduct));

// get top 8 best selling
router.get("/get-bestselling", catchAsyncErrors(highestSoldProduct));

// get top 8 latest
router.get("/get-latestdrops", catchAsyncErrors(getLatestProducts));

// get all products
router.get("/get-all-products", catchAsyncErrors(getAllProducts));

router.get("/c/:name", catchAsyncErrors(getCategories));

// Define the route for filtered and paginated products
router.get("/products", getProducts);

// Define the route for filtered and paginated products
router.get("/search", searchProducts);

// delete Product of a shop
router.delete(
  "/delete-shop-products/:id",
  sellerIsAuthenticated,
  catchAsyncErrors(deleteShopProducts)
);

module.exports = router;
