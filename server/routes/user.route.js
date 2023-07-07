const express = require("express");
const router = express.Router();
const {
  register,
  activate,
  login,
  getUser,
  getLogout,
  updateUserInfo,
  updateUserAddress,
  deleteUserAddress,
  updateUserPassword,
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
router.put(
  "/update-user-info",
  isAuthenticated,
  upload.single("file"),
  catchAsyncErrors(updateUserInfo)
);
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(updateUserAddress)
);
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(deleteUserAddress)
);
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(updateUserPassword)
);
module.exports = router;
