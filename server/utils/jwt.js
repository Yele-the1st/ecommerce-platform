const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "config/.env",
});

// create token for activation of user
exports.tokenize = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// verify token for activation of user
exports.deTokenize = (token) => {
  return jwt.verify(token, process.env.ACTIVATION_SECRET);
};

// create

// create token for user authentication and set cookies
exports.sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
