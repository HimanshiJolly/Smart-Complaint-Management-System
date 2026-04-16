const express = require('express');
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Create a complaint (User only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newComplaint = new Complaint({ userId: req.user.id, title, description });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get complaints (Users see theirs, Admins see all)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const complaints = await Complaint.find(filter).populate('userId', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;