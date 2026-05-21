const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// ==========================================
// CREATE UPLOADS FOLDER IF NOT EXISTS
// ==========================================

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, 'uploads/');

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  }

});

const upload = multer({ storage });

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

router.get(
  '/profile',
  protect,

  async (req, res) => {

    try {

      const user = await User.findById(
        req.user.id
      ).select('-password');

      if (!user) {

        return res.status(404).json({
          message: 'User not found'
        });

      }

      res.json(user);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);

// ==========================================
// UPDATE USER PROFILE
// ==========================================

router.put(
  '/profile',
  protect,
  upload.single('passportPhoto'),

  async (req, res) => {

    try {

      const user = await User.findById(
        req.user.id
      );

      if (!user) {

        return res.status(404).json({
          message: 'User not found'
        });

      }

      // ==========================================
      // UPDATE FIELDS
      // ==========================================

      const fields = [

        'fullName',
        'collegeEmail',
        'rollNumber',
        'phone',
        'semester',
        'department',
        'course',
        'branch',
        'hostelStatus',
        'roomNumber',
        'address',
        'fatherName',
        'motherName',
        'mentorName',
        'dob',
        'gender'

      ];

      fields.forEach((field) => {

        if (
          req.body[field] !== undefined
        ) {

          user[field] = req.body[field];

        }

      });

      // ==========================================
      // UPDATE PROFILE PHOTO
      // ==========================================

      if (req.file) {

        // DELETE OLD PHOTO
        if (user.passportPhoto) {

          const oldPath = path.join(
            __dirname,
            '..',
            user.passportPhoto
          );

          if (fs.existsSync(oldPath)) {

            fs.unlinkSync(oldPath);

          }

        }

        // SAVE NEW PHOTO
        passportPhoto:
  req.files?.passportPhoto
    ? req.files.passportPhoto[0].path
    : null;

      }

      // ==========================================
      // SAVE USER
      // ==========================================

      await user.save();

      // REMOVE PASSWORD
      const updatedUser =
        await User.findById(
          req.user.id
        ).select('-password');

      res.json({

        message:
          'Profile updated successfully',

        user: updatedUser

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);

module.exports = router;