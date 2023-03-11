const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    userId: "6407ab86733238ba55e131d3",
  };

  next();
});
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("ВСЕ ЗАЕБИСЬ");
});
