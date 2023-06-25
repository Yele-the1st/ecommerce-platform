const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Enter coupon code."],
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minAmount: Number,
    maxAmount: Number,
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
