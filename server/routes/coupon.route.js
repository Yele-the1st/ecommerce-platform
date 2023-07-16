const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const {
  createCoupon,
  getShopCoupons,
  deleteShopCoupon,
  getCoupon,
} = require("../controllers/coupon.controller");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sellerIsAuthenticated } = require("../middleware/auth");

// Create a coupon
router.post(
  "/create-coupon",
  [body("name").notEmpty().withMessage("Name is required")],

  catchAsyncErrors(createCoupon)
);

// get All coupon
router.get("/get-all-shop-coupons/:id", catchAsyncErrors(getShopCoupons));

// delete coupon of a shop
router.delete(
  "/delete-shop-coupon/:id",
  sellerIsAuthenticated,
  catchAsyncErrors(deleteShopCoupon)
);

// get single coupon
router.get("/get-coupon-value/:name", catchAsyncErrors(getCoupon));

module.exports = router;
