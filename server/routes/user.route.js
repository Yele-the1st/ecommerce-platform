const express = require("express");
const router = express.Router();
const {
  register,
  activate,
  login,
  getUser,
  getLogout,
} = require("../controllers/user.controller");
const { upload } = require("../middleware/multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

// Create a user
router.post("/register-user", upload.single("file"), register);
router.post("/activate-user", catchAsyncErrors(activate));
router.post("/login-user", catchAsyncErrors(login));
router.get("/get-user", isAuthenticated, catchAsyncErrors(getUser));
router.get("/logout-user", isAuthenticated, catchAsyncErrors(getLogout));

module.exports = router;
