const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    category: {
      type: String,
      required: [true, "Product category is required."],
    },
    tags: {
      type: String,
      required: [true, "Product tags are required."],
    },
    originalPrice: {
      type: Number,
      required: [true, "Product original price is required."],
    },
    discountedPrice: Number,
    stock: {
      type: Number,
      required: [true, "Product stock is required."],
    },
    images: [String],
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// // Create the text index
// productSchema.index({ name: "text", description: "text" }, function (err) {
//   if (err) {
//     console.error("Error creating text index:", err);
//   } else {
//     console.log("Text index created successfully");
//   }
// });

module.exports = mongoose.model("Product", productSchema);

// // Drop the text index
// Product.collection.dropIndex(
//   "title_text_description_text",
//   function (err, result) {
//     if (err) {
//       console.error("Error dropping text index:", err);
//     } else {
//       console.log("Text index dropped successfully");
//     }
//   }
// );
