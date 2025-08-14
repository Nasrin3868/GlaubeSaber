const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  countryCode:{
    type:String,
    required:true
  },
  contactNumber:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("usercollection", userschema);
