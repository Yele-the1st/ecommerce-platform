const express = require("express");
const router = express.Router();
const { register, activate, login } = require("../controllers/user.controller");
const { upload } = require("../middleware/multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create a user
router.post("/register-user", upload.single("file"), register);
router.post("/activate-user", catchAsyncErrors(activate));
router.post("/login-user", catchAsyncErrors(login));

module.exports = router;
