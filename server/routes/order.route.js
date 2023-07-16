const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
} = require("../controllers/order.controller");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

// Create a Shop
router.post("/create-order", isAuthenticated, catchAsyncErrors(createOrder));
router.get(
  "/get-all-orders/:userId",
  isAuthenticated,
  catchAsyncErrors(getUserOrders)
);

module.exports = router;
