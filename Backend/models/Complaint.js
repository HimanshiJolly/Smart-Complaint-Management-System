const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Cleanliness', 'Management', 'Infrastructure', 'Food/Hostel', 'Other'], 
    default: 'Other' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  priority: { type: Number, enum: [1, 2, 3], default: 1 },
  imageUrl: { type: String, default: null },

  isClearedByUser: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);  // ✅ THIS LINE FIXES EVERYTHING