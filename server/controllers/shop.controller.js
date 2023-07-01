const Shop = require("../models/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const { tokenize, deTokenize, sendShopToken } = require("../utils/jwt");
const sendMail = require("../utils/sendMail");

exports.createShop = async (req, res, next) => {
  try {
    const { email } = req.body;

    const shopExists = await Shop.exists({ email });
    if (shopExists) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const { shopname, address, phoneNumber, zipcode, password } = req.body;

    const shop = {
      shopname,
      email,
      password,
      avatar: fileUrl,
      address,
      phoneNumber,
      zipcode,
    };

    const activationToken = tokenize(shop);

    const activationUrl = `http://localhost:3000/auth/shop/activation/${activationToken}`;

    await sendMail({
      email: shop.email,
      subject: "Activate your Shop account",
      message: `Hello ${shop.shopname}, please click on the link to activate your Shop account: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${shop.email}) to activate your Shop account!`,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newShop = deTokenize(activation_token);
    console.log(newShop);

    if (!newShop) {
      throw new ErrorHandler("Invalid token", 400);
    }

    const { shopname, address, phoneNumber, avatar, zipcode, password, email } =
      newShop;

    const shopExists = await Shop.exists({ email });
    if (shopExists) {
      throw new ErrorHandler("User already exists", 400);
    }

    // Create a new user object
    const shop = new Shop({
      shopname,
      address,
      phoneNumber,
      zipcode,
      password,
      email,
      avatar,
    });

    // Save the user in the database
    const savedShop = await shop.save();
    console.log(`iscontroller ${savedShop}`);

    sendShopToken(savedShop, 201, res);
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler(" Please provide both email and password.", 400);
    }

    const shop = await Shop.findOne({ email }).select("+password");

    if (!shop) {
      throw new ErrorHandler(" User doesn't exist.", 400);
    }

    const isPasswordValid = await shop.comparePassword(password);

    if (!isPasswordValid) {
      throw new ErrorHandler(" Please provide the correct information", 400);
    }
    console.log(`islogincontroller ${shop}`);
    sendShopToken(shop, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.getShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;

    // Find the shop by its ID and populate products and events
    const shop = await Shop.findById(shopId)
      .populate("products")
      .populate("events");

    // If shop is not found
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // res.setHeader(
    //   "Cache-Control",
    //   "no-store, no-cache, must-revalidate, private"
    // );
    // res.setHeader("Pragma", "no-cache");
    // res.setHeader("Expires", "0");
    res.status(200).json({
      success: true,
      seller: shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      sucess: true,
      message: "Log out Successful ",
    });
    console.log("logged out");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};
