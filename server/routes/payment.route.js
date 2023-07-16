const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  processPayment,
  stripeapikey,
} = require("../controllers/payment.controller");
const { isAuthenticated } = require("../middleware/auth");

router.post("/process", isAuthenticated, catchAsyncErrors(processPayment));

router.get("/stripeapikey", isAuthenticated, catchAsyncErrors(stripeapikey));

module.exports = router;
