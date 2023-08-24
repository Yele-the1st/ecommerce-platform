const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Event Product name is required."],
    },
    description: {
      type: String,
      required: [true, "Event Product description is required."],
    },
    category: {
      type: String,
      required: [true, "Event Product category is required."],
    },
    tags: {
      type: String,
      required: [true, "Event Product tags are required."],
    },
    originalPrice: {
      type: Number,
      required: [true, " Event Product original price is required."],
    },
    discountedPrice: Number,
    stock: {
      type: Number,
      required: [true, "Event Product stock is required."],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    finish_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "Running",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
