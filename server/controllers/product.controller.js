const Product = require("../models/product");
const Shop = require("../models/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const { validationResult } = require("express-validator");

// create a Product
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const productData = req.body;
    const shopId = productData.shopId;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new ErrorHandler("Shop Id is invalid!", 400);
    }

    const files = req.files;
    const imageUrls = files.map(({ filename }) => filename);
    productData.images = imageUrls;

    const product = await Product.create(productData);

    shop.products.push(product._id);
    await shop.save();

    // const populatedProduct = await Product.findById(product._id).populate(
    //   "shopId"
    // );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      // product: populatedProduct,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get All shop Products
exports.getShopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(201).json({
      sucess: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// get a Product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate(
      "shopId"
    );

    res.status(200).json({
      sucess: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// delete Product of a shop

exports.deleteShopProducts = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      throw new ErrorHandler("Product not found with this id!", 500);
    }

    if (product.images.length > 0) {
      // Delete product images
      await Promise.all(
        product.images.map(async (imageUrl) => {
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

    // Delete product from database
    await Product.findByIdAndDelete(productId);
    // Remove product reference from shop
    const shopId = product.shopId;
    await Shop.updateOne({ _id: shopId }, { $pull: { products: productId } });

    res.status(201).json({
      success: true,
      message: "Product Deleted Successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

exports.highestSoldProduct = async (req, res, next) => {
  try {
    // Adjust the limit as per your requirements
    const products = await Product.find()
      .sort({ sold_out: -1 })
      .limit(8)
      .populate("shopId"); // Populate the shopId field with the 'name' property of the Shop model
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

exports.getLatestProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("shopId");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("shopId");
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// Utility function to parse the price range string
const parsePriceRange = (priceRange) => {
  const [min, max] = priceRange.split("-").map((value) => parseFloat(value));
  return { min, max };
};

exports.getProducts = async (req, res, next) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1; // Current page number, default: 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of products per page, default: 10
    const category = req.query.category; // Filter by category
    const priceRange = req.query.priceRange; // Filter by price range
    const sort = req.query.sort; // Sorting criteria

    // Create a query object with the filter conditions
    const query = {};

    if (category) {
      query.category = category;
    }

    if (priceRange) {
      const { min, max } = parsePriceRange(priceRange);
      query.originalPrice = { $gte: min, $lte: max };
    }

    // Apply sorting
    const sortOptions = {};

    if (sort === "sales") {
      sortOptions.sold_out = -1; // Sort by sales in descending order
    } else if (sort === "createdAt") {
      sortOptions.createdAt = -1; // Sort by createdAt in descending order
    } else if (sort === "priceAsc") {
      sortOptions.originalPrice = 1; // Sort by originalPrice in ascending order
    } else if (sort === "priceDesc") {
      sortOptions.originalPrice = -1; // Sort by originalPrice in descending order
    }
    // Add other sorting options as needed

    // Apply pagination
    const totalProducts = await Product.countDocuments(query); // Total number of products matching the filter
    const totalPages = Math.ceil(totalProducts / pageSize); // Total number of pages
    const skip = (page - 1) * pageSize; // Number of products to skip

    // Fetch the products based on the query, sorting, and pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .populate("shopId");

    res.status(200).json({
      success: true,
      page,
      pageSize,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// Backend - Express.js route handler for search endpoint

exports.searchProducts = async (req, res, next) => {
  const query = req.query.query; // Assuming the search query is passed as a query parameter

  try {
    // Perform the search query on the Product collection
    const searchResults = await Product.find({
      $text: { $search: query },
    });

    res.json({ results: searchResults });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler(error, 400));
  }
};

// Route to get the data of a specific category based on the name
exports.getCategories = async (req, res, next) => {
  const categoryName = req.params.name.toLowerCase();

  try {
    // Query the database to find products with the matching category name
    const products = await Product.find({ category: categoryName }).populate(
      "shopId"
    );

    res.status(200).json(products);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
