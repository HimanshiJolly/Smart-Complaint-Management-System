const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();


// ================= REGISTER =================

router.post('/register', async (req, res) => {

  try {

    const {

      fullName,
      collegeEmail,
      rollNumber,
      phone,
      semester,
      department,
      address,
      fatherName,
      motherName,
      mentorName,
      dob,
      gender,
      password,
      role

    } = req.body;

    // CHECK EXISTING USER

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

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER

    const newUser = new User({

      fullName,
      collegeEmail,
      rollNumber,
      phone,
      semester,
      department,
      address,
      fatherName,
      motherName,
      mentorName,
      dob,
      gender,

      password: hashedPassword,

      role: role || 'user'

    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// ================= LOGIN =================

router.post('/login', async (req, res) => {

  try {

    const { rollNumber, password } = req.body;

    // FIND USER

    const user = await User.findOne({ rollNumber });

    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      });

    }

    // CHECK PASSWORD

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: 'Invalid credentials'
      });

    }

    // CREATE TOKEN

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

    // RESPONSE

    res.json({

      token,

      user: {

        id: user._id,

        fullName: user.fullName,

        rollNumber: user.rollNumber,

        role: user.role

      }

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;