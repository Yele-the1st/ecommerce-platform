const Coupon = require("../models/coupon");
const Shop = require("../models/shop");
const Product = require("../models/product");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const { validationResult } = require("express-validator");

// create a coupon
exports.createCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const { selectedProduct, ...couponData } = req.body;
    const name = couponData.name;

    const couponExists = await Coupon.exists({ name });
    if (couponExists) {
      throw new ErrorHandler("Coupon Already Exist!", 400);
    }

    const product = await Product.findOne({ name: selectedProduct });
    const productId = product._id;

    couponData.productId = productId;

    const coupon = await Coupon.create(couponData);

    const populatedCoupon = await Coupon.findById(coupon._id).populate(
      "shopId"
    );

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon: populatedCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get All coupon
exports.getShopCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ shopId: req.params.id });
    res.status(201).json({
      sucess: true,
      coupons,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// delete coupon of a shop

exports.deleteShopCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.id;

    // Delete event from database
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      throw new ErrorHandler("coupon not found with this id!", 500);
    }

    res.status(201).json({
      success: true,
      message: "Coupon Deleted Successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get Single Coupon Value

exports.getCoupon = async (req, res, next) => {
  try {
    const couponCode = await Coupon.findOne({ name: req.params.name });

    if (!couponCode) {
      return next(new ErrorHandler("Coupon doesnt exist!", 500));
    }

    res.status(201).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
