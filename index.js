const express = require("express");
const dotenv = require("dotenv");
const mongoDB = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

mongoDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    app.use("/api", require("./Routes/CreateUser"));
    app.use("/api", require("./Routes/DisplayData"));
    app.use("/api", require("./Routes/OrderData"));
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connct to the database:", error);
  });
