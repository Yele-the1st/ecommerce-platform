const Event = require("../models/event");
const Shop = require("../models/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary");

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

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "events",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const productData = req.body;
    productData.images = imagesLinks;

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

// get an Event
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById({ _id: req.params.id }).populate(
      "shopId"
    );

    res.status(200).json({
      sucess: true,
      event,
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

    const imagePublicIds = event.images.map((image) => image.public_id);

    // Delete images from cloud storage
    await Promise.all(
      imagePublicIds.map((publicId) => cloudinary.v2.uploader.destroy(publicId))
    );

    // Delete product from database and remove product reference from shop
    await Promise.all([
      Event.findByIdAndDelete(eventId),
      Shop.updateOne({ _id: event.shopId }, { $pull: { events: eventId } }),
    ]);

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
    console.log(events);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
 