// Node/Express server
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

//Connect to Database
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("Database is connected successfully..."))
  .catch((err) => console.log("Database Error => ", err));

//? Import Routes
const authRoutes = require("./routes/auth");

// App Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors()) // allow all origin

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

//? Used as Middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`);
});
