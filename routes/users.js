var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/insta-clone");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  password: {
    type: String,
  },
  following: [
    {
     type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default:[]

    },
  ],
  followers: [
  {  type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    default:[]}
  ],

  bio: {
    type: String,
  },
  porfile_pic: {
    type: String,
  },
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
