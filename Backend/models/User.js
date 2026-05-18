const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  collegeEmail: {
    type: String,
    required: true,
    unique: true
  },

  rollNumber: {
    type: String,
    required: true,
    unique: true
  },

  phone: String,

  semester: String,

  department: String,

  address: String,

  fatherName: String,

  motherName: String,

  mentorName: String,

  dob: String,

  gender: String,

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "user"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);