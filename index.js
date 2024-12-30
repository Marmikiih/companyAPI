"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./models"); 
const Routes = require("./routes"); 
const { rootRoute }  = require("./helpers/rootRoute"); 

const app = express();
const PORT = process.env.PORT || 3011;

// Middleware
app.use(morgan('dev')) // :method :url :status :res[content-length] - :response-time ms
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", rootRoute);
app.use("/api", Routes);

// Test Database Connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
