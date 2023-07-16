const Product = require("../models/product");
const Order = require("../models/order");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const { validationResult } = require("express-validator");

exports.createOrder = async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // group cart Items by shopId
    const shopItemsMap = cart.reduce((map, item) => {
      const { _id } = item.shopId;
      if (!map.has(_id)) {
        map.set(_id, []);
      }
      map.get(_id).push(item);
      return map;
    }, new Map());

    // create an order for each shop
    const createOrderPromises = Array.from(shopItemsMap).map(
      async ([_id, items]) => {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        return order;
      }
    );

    const orders = await Promise.all(createOrderPromises);

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get all User Orders

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
