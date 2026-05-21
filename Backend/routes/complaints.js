const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Complaint = require('../models/Complaint');
const User = require('../models/User');

const { protect, adminOnly } = require('../middleware/auth');
const ComplaintPriorityQueue = require('../utils/PriorityQueue');

const router = express.Router();

// ==========================================
// CREATE UPLOADS FOLDER IF NOT EXISTS
// ==========================================

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==========================================
// MULTER SETUP
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ==========================================
// CREATE COMPLAINT
// ==========================================

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    let assignedPriority = 1;

    if (
      category === 'Infrastructure' ||
      category === 'Food/Hostel'
    ) {
      assignedPriority = 3;
    }

    else if (
      category === 'Cleanliness' ||
      category === 'Management'
    ) {
      assignedPriority = 2;
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const newComplaint = new Complaint({
      userId: req.user.id,
      title,
      description,
      category,
      priority: assignedPriority,
      imageUrl
    });

    const savedComplaint = await newComplaint.save();

    res.status(201).json(savedComplaint);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================================
// GET ALL COMPLAINTS
// ==========================================

router.get('/', protect, async (req, res) => {

  try {

    let complaints;

    // ADMIN + SUPERADMIN
    if (
      req.user.role === 'admin' ||
      req.user.role === 'superadmin'
    ) {

      complaints = await Complaint.find()
        .populate(
          'userId',
          'fullName department'
        )
        .sort({ createdAt: -1 });

    }

    // NORMAL USER
    else {

      complaints = await Complaint.find({
        userId: req.user.id,
        isClearedByUser: false
      }).sort({ createdAt: -1 });

    }

    res.json(complaints);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server Error'
    });

  }

});
// ==========================================
// GET MOST URGENT COMPLAINT
// ==========================================

router.get('/urgent', protect, adminOnly, async (req, res) => {
  try {

    const pendingComplaints = await Complaint.find({
      status: 'Pending'
    });

    if (pendingComplaints.length === 0) {
      return res.json({
        message: 'No pending complaints'
      });
    }

    const pq = new ComplaintPriorityQueue();

    pendingComplaints.forEach(c => pq.insert(c));

    res.json({
      complaint: pq.extractMax()
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================================
// CLEAR COMPLAINT
// ==========================================

router.put('/clear/:id', protect, async (req, res) => {
  try {

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        isClearedByUser: true
      },
      {
        new: true
      }
    );

    res.json(complaint);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================================
// UPDATE STATUS
// ==========================================

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {

    const { status } = req.body;

    const updatedComplaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.json(updatedComplaint);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================================
// EXPORT
// ==========================================

module.exports = router;