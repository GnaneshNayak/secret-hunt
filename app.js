require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", () =>
  console.log("connected mongoose")
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
console.log(process.env.API_KEY);
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (err) console.log(err);
    else res.render("secrets");
  });
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, result) => {
    if (err) console.log(err);
    else {
      if (result) {
        if (result.password === password) {
          res.render("secrets");
        } else console.log("wrong password");
      }
    }
  });
});

app.listen(3000, () => console.log("app listening @ localhost 3000"));
