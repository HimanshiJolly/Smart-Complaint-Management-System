const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');

const router = express.Router();


// ================= UPLOADS =================

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({ storage });


// ===================================================
// USER REGISTER
// ===================================================

router.post(
  '/register/user',

  upload.fields([
    { name: 'idProofPhoto', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 }
  ]),

  async (req, res) => {

    try {

      const {
        fullName,
        collegeEmail,
        rollNumber,
        phone,
        semester,
        department,
        course,
        branch,
        hostelStatus,
        roomNumber,
        address,
        fatherName,
        motherName,
        mentorName,
        dob,
        gender,
        password
      } = req.body;

      const existingUser = await User.findOne({
        $or: [
          { collegeEmail },
          { rollNumber }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({

        role: 'user',

        fullName,
        collegeEmail,
        rollNumber,
        phone,
        semester,
        department,
        course,
        branch,
        hostelStatus,
        roomNumber,
        address,
        fatherName,
        motherName,
        mentorName,
        dob,
        gender,

        idProofPhoto: req.files?.idProofPhoto
          ? `/uploads/${req.files.idProofPhoto[0].filename}`
          : null,

        passportPhoto: req.files?.passportPhoto
          ? `/uploads/${req.files.passportPhoto[0].filename}`
          : null,

        password: hashedPassword

      });

      await newUser.save();

      res.status(201).json({
        message: 'User registered successfully'
      });

    } catch (err) {

  console.log(err);

  res.status(500).json({
    error: err.message
  });

}
  }
);

// ================= ADMIN LOGIN =================

router.post('/login/admin', async (req, res) => {

  try {

    const { adminId, password } = req.body;

    // FIND ADMIN
    const admin = await User.findOne({
      adminId
    });

    if (!admin) {

      return res.status(404).json({
        message: 'Admin not found'
      });

    }

    // CHECK ROLE
    if (
      admin.role !== 'admin' &&
      admin.role !== 'superadmin'
    ) {

      return res.status(403).json({
        message: 'Not authorized as admin'
      });

    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: 'Invalid credentials'
      });

    }

    // TOKEN
    const token = jwt.sign(

      {
        id: admin._id,
        role: admin.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d'
      }
    );

    res.json({

      token,

      user: {

        id: admin._id,

        name:
          admin.adminName || 'Admin',

        role: admin.role,

        adminId: admin.adminId

      }

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// ===================================================
// USER LOGIN
// ===================================================

router.post('/login/user', async (req, res) => {

  try {

    const { rollNumber, password } = req.body;

    const user = await User.findOne({
      rollNumber,
      role: 'user'
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.json({

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role
      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ===================================================
// ADMIN REGISTER
// ===================================================

router.post('/register/admin', async (req, res) => {

  try {

    const {
      adminName,
      adminEmail,
      adminPhone,
      adminId,
      password
    } = req.body;

    const existingAdmin = await User.findOne({
      $or: [
        { adminEmail },
        { adminId }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Admin already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({

      role: 'admin',

      adminName,
      adminEmail,
      adminPhone,
      adminId,

      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin registered successfully'
    });

  } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// ===================================================
// ADMIN LOGIN
// ===================================================

router.post('/login/admin', async (req, res) => {

  try {

    const { adminId, password } = req.body;

    const admin = await User.findOne({
      adminId,
      role: 'admin'
    });

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.json({

      token,

      user: {
        id: admin._id,
        adminName: admin.adminName,
        role: admin.role
      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;