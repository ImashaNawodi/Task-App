const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    default: uuidv4,  
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
