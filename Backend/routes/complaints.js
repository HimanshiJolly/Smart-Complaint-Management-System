const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');
const ComplaintPriorityQueue = require('../utils/PriorityQueue');
const router = express.Router();

// --- AUTO-CREATE UPLOADS DIRECTORY ---
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- MULTER SETUP FOR IMAGE UPLOADS ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Give it a unique name
  }
});
const upload = multer({ storage: storage });


// ==========================================
//                 ROUTES
// ==========================================

// 1. CREATE A COMPLAINT (WITH IMAGE & AUTO-PRIORITY)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // AUTO-PRIORITY LOGIC based on category
    let assignedPriority = 1; // Default to Low Priority
    if (category === 'Infrastructure' || category === 'Food/Hostel') {
      assignedPriority = 3; // High Priority
    } else if (category === 'Cleanliness' || category === 'Management') {
      assignedPriority = 2; // Medium Priority
    }

    // Get image path if a file was uploaded successfully
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newComplaint = new Complaint({
      userId: req.user.id, // Extracted from protect middleware
      title,
      description,
      category,
      priority: assignedPriority, // Automatically assigned by backend
      imageUrl
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 2. GET ALL COMPLAINTS (User sees their own, Admin sees all)
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      // Admins see everything, newest first
      complaints = await Complaint.find().sort({ createdAt: -1 });
    } else {
      // Standard users only see their own complaints
      complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 3. ADMIN ONLY: GET MOST URGENT COMPLAINT (USING PRIORITY QUEUE)
router.get('/urgent', protect, adminOnly, async (req, res) => {
  try {
    // Fetch only complaints that haven't been resolved yet
    const pendingComplaints = await Complaint.find({ status: 'Pending' });
    
    if (pendingComplaints.length === 0) {
      return res.json({ message: 'No pending complaints at the moment!' });
    }

    // Insert into our custom O(log N) Max Heap Data Structure
    const pq = new ComplaintPriorityQueue();
    pendingComplaints.forEach(c => pq.insert(c));
    
    // Extract the one with the highest priority
    res.json({ complaint: pq.extractMax() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 4. ADMIN ONLY: UPDATE COMPLAINT STATUS
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );
    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Ensure the router is exported at the very bottom!
module.exports = router;