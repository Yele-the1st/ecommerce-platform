const Event = require("../models/event");
const Shop = require("../models/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const { validationResult } = require("express-validator");

// create a Product
exports.createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const eventData = req.body;
    const shopId = eventData.shopId;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new ErrorHandler("Shop Id is invalid!", 400);
    }

    const files = req.files;
    const imageUrls = files.map(({ filename }) => filename);
    eventData.images = imageUrls;

    const event = await Event.create(eventData);

    shop.events.push(event._id);
    await shop.save();

    // const populatedEvent = await Event.findById(event._id).populate("shopId");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      // event: populatedEvent,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get All Product
exports.getShopEvents = async (req, res, next) => {
  try {
    const products = await Event.find({ shopId: req.params.id });
    res.status(201).json({
      sucess: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// delete Product of a shop

exports.deleteShopEvents = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      throw new ErrorHandler("Event not found with this id!", 500);
    }

    if (event.images.length > 0) {
      // Delete event images
      await Promise.all(
        event.images.map(async (imageUrl) => {
          const filename = imageUrl;
          const filePath = `uploads/${filename}`;

          try {
            await fs.promises.unlink(filePath);
          } catch (err) {
            console.log(err);
          }
        })
      );
    }

    // Delete event from database
    await Event.findByIdAndDelete(eventId);

    res.status(201).json({
      success: true,
      message: "Event Deleted Successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
