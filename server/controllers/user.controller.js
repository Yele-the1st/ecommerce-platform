const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

exports.Register = async (req, res, next) => {
  try {
    // fetch data from the request body

    const { fullname, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    // if the user email already exist, delete the file uploaded already
    // and return an error message. User already exist

    if (userEmail) {
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

    // if user is new, store the info into a user const

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = new User({
      fullname,
      email,
      password,
      avatar: fileUrl,
    });

    console.log(user);
    // Save the user to the database

    // Handle the response
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
