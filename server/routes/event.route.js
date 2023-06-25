const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const {
  createEvent,
  deleteShopEvents,
  getShopEvents,
} = require("../controllers/event.controller");
const { upload } = require("../middleware/multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sellerIsAuthenticated } = require("../middleware/auth");

// Create an Event
router.post(
  "/create-event",
  upload.array("images"),
  [body("name").notEmpty().withMessage("Name is required")],

  catchAsyncErrors(createEvent)
);

// get All Events
router.get("/get-all-shop-events/:id", catchAsyncErrors(getShopEvents));

// delete Event
router.delete(
  "/delete-shop-events/:id",
  sellerIsAuthenticated,
  catchAsyncErrors(deleteShopEvents)
);

module.exports = router;
