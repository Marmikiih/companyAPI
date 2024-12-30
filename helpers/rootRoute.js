const express = require("express");
const rootRouter = express.Router();

const rootRoute = (req, res) => {
  const styles = `
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                text-align: center;
                padding: 100px;
              }
              h1 {
                color: #333;
                font-size: 36px;
              }
              p {
                color: #666;
                font-size: 18px;
                margin-top: 20px;
              }
            </style>
          `;

  const message = `
            <h1>COMPANY API - MARMIK - IIH </h1>
            <p>COMPANY MANAGEMENT!</p>
          `;

  res.send(styles + message);
};

rootRouter.get("/", rootRoute);

module.exports = {
  rootRouter,
  rootRoute,
};
