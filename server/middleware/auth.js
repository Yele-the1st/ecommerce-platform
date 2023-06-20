const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/user");
const Shop = require("../models/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ErrorHandler("Please login to continue", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`decoded ${decoded.id}`);
    req.user = await User.findById(decoded.id);
    console.log(`isAuth ${req.user}`);
    next();
  } catch (error) {
    console.log(`authspecific Error ${error}`);
    return next(new ErrorHandler("Invalid token", 401));
  }
});
exports.sellerIsAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    throw new ErrorHandler("Please login to continue", 401);
  }

  try {
    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);
    console.log(`decoded ${decoded.id}`);
    req.seller = await Shop.findById(decoded.id);
    console.log(`isAuth ${req.seller}`);
    next();
  } catch (error) {
    console.log(`authspecific Error ${error}`);
    return next(new ErrorHandler("Invalid token", 401));
  }
});
