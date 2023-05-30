const User = require("../models/user");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const { tokenize, deTokenize, sendToken } = require("../utils/jwt");
const sendMail = require("../utils/sendMail");

exports.register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    const userExists = await User.exists({ email });
    if (userExists) {
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

    const user = {
      fullname,
      email,
      password,
      avatar: fileUrl,
    };

    const activationToken = tokenize(user);

    const activationUrl = `http://localhost:3000/auth/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.fullname}, please click on the link to activate your account: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${user.email}) to activate your account!`,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = deTokenize(activation_token);
    console.log(newUser);

    if (!newUser) {
      throw new ErrorHandler("Invalid token", 400);
    }

    const { fullname, email, password, avatar } = newUser;

    const userExists = await User.exists({ email });
    if (userExists) {
      throw new ErrorHandler("User already exists", 400);
    }

    // Create a new user object
    const user = new User({
      fullname,
      email,
      password,
      avatar,
    });

    // Save the user in the database
    const savedUser = await user.save();
    console.log(`iscontroller ${savedUser}`);

    sendToken(savedUser, 201, res);
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

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ErrorHandler(" User doesn't exist.", 400);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ErrorHandler(" Please provide the correct information", 400);
    }
    console.log(`islogincontroller ${user}`);
    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ErrorHandler(" User doesn't exist.", 400);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
