const express = require("express");
const app = express();
const data = require("./db.json");
const dotenv = require("dotenv");
const connectMongo = require("./config/db");

dotenv.config();
connectMongo();

/*
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
*/

app.get("/", (req, res) => {
  res.send("API is loading ...");
});

app.get("/notes", (req, res) => {
  res.json(data.notes);
});

app.get("/notes/:id", (req, res) => {
  const note = data.notes.find((note) => note._id === req.params.id);

  res.json(note);
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, console.log(`currently listen to port ${PORT}`));
