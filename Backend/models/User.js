const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  // ================= USER =================

  fullName: String,

  collegeEmail: {
    type: String,
    unique: true,
    sparse: true
  },

  rollNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  phone: String,

  semester: String,

  department: String,

  course: String,

  branch: String,

  hostelStatus: String,

  roomNumber: String,

  address: String,

  fatherName: String,

  motherName: String,

  mentorName: String,

  dob: String,

  gender: String,

  idProofPhoto: String,

  passportPhoto: String,


  // ================= ADMIN =================

  adminName: String,

  adminEmail: {
    type: String,
    unique: true,
    sparse: true
  },

  adminPhone: String,

  adminId: {
    type: String,
    unique: true,
    sparse: true
  },


  // ================= COMMON =================

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);