const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//middlewares
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"));

// CORS
app
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  })
  .use(cors({ origin: true, credentials: true }));

module.exports = app;
