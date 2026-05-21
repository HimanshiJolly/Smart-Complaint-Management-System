const express = require('express');

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const { protect } = require('../middleware/auth');

const superAdminOnly = require('../middleware/superAdminOnly');

const router = express.Router();
const Complaint = require('../models/Complaint');


// CREATE ADMIN
router.post(
  '/create-admin',
  protect,
  superAdminOnly,

  async (req, res) => {

    try {

      const {
        adminName,
        adminEmail,
        adminId,
        password
      } = req.body;

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      const admin = await User.create({

        adminName,

        adminEmail,

        adminId,

        password: hashedPassword,

        role: 'admin'

      });

      res.status(201).json(admin);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }
  }
);

router.get(
  '/students',
  protect,
  superAdminOnly,

  async (req, res) => {
    try {
      const students = await User.find({
        role: 'user'
      }).select('-password');

      const enriched = await Promise.all(
        students.map(async (student) => {
          const total = await Complaint.countDocuments({
            userId: student._id
          });

          const pending = await Complaint.countDocuments({
            userId: student._id,
            status: 'Pending'
          });

          const resolved = await Complaint.countDocuments({
            userId: student._id,
            status: 'Resolved'
          });

          return {
            ...student._doc,
            totalComplaints: total,
            pendingComplaints: pending,
            resolvedComplaints: resolved
          };
        })
      );

      res.json(enriched);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);
// GET ALL ADMINS
router.get(
  '/admins',
  protect,
  superAdminOnly,

  async (req, res) => {

    const admins = await User.find({
      role: 'admin'
    });

    res.json(admins);
  }
);


// DELETE ADMIN
router.delete(
  '/:id',
  protect,
  superAdminOnly,

  async (req, res) => {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: 'Admin Deleted'
    });
  }
);

// ==========================================
// ADMIN ANALYTICS
// GET /api/admin/analytics
// ==========================================
router.get(
  '/analytics',
  protect,
  superAdminOnly,
  async (req, res) => {
    try {
      const [
        totalStudents,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        categoryAgg
      ] = await Promise.all([
        // total registered students
        User.countDocuments({ role: 'user' }),

        // all complaints
        Complaint.countDocuments({}),

        // pending complaints
        Complaint.countDocuments({ status: 'Pending' }),

        // resolved complaints
        Complaint.countDocuments({ status: 'Resolved' }),

        // category breakdown
        Complaint.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const categories = [
        'Cleanliness',
        'Management',
        'Infrastructure',
        'Food/Hostel',
        'Other'
      ];

      const categoryStats = categories.reduce((acc, cat) => {
        const found = (categoryAgg || []).find(
          (x) => x._id === cat
        );
        acc[cat] = found ? found.count : 0;
        return acc;
      }, {});

      res.json({
        totalStudents,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        categoryStats
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

module.exports = router;
