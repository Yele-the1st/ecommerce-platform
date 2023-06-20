const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category"],
  },
  tags: {
    type: String,
    required: [true, "Please enter your product tags"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter your product "],
  },
  discountedPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: 
});
