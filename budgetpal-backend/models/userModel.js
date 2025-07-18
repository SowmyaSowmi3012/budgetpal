const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  profilePic: String, // store as image URL
  // other fields like email, password if needed
});

module.exports = mongoose.model("User", userSchema);
