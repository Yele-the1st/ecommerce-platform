const express = require("express");
const router = express.Router();
const {
  createShop,
  activate,
  login,
  getShop,
} = require("../controllers/shop.controller");
const { upload } = require("../middleware/multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sellerIsAuthenticated } = require("../middleware/auth");

// Create a Shop
router.post("/create-shop", upload.single("file"), createShop);
router.post("/activate-shop", catchAsyncErrors(activate));
router.post("/login-shop", catchAsyncErrors(login));
router.get("/get-shop", sellerIsAuthenticated, catchAsyncErrors(getShop));

module.exports = router;
