const express = require("express");
const errorHandlerMiddleware = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.route");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/", express.static("uploads"));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Mount the routes
app.use("/api/users", userRoutes);

// Errorhandling Middleware
app.use(errorHandlerMiddleware);

module.exports = app;
