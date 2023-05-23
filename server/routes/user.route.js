const express = require("express");
const router = express.Router();
const { Register } = require("../controllers/user.controller");
const { upload } = require("../middleware/multer");

// Create a user
router.post("/register-user", upload.single("file"), Register);

module.exports = router;
