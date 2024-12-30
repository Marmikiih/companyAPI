const { sequelize } = require("./configs/db");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const server = createServer(app);
const app = express();

// HOME PAGE
app.get("/", (req, res) => {
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

  const hrmsMessage = `
        <h1>COMPANY API - MARMIK - IIH </h1>
        <p>COMPANY MANAGEMENT!</p>
      `;

  res.send(styles + hrmsMessage);
});

app.use(cors());

// Config the server to parse the json
app.use(express.json());

// morgan configurations to print api request logs
const morgan = require("morgan");

// Print api request log into terminal.
// here we are used dev format to print logs into terminal because it's print quick overview about user request with colorful output
app.use(morgan("dev"));

// Listning the server port
server.listen(3010, () => {
  console.log(`Server is started on port: 3010`);
});

sequelize.sync({ alter: true }).catch((error) => {
  console.log("Sync Error", error);
});
