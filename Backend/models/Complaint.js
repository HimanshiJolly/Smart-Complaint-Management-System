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
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  priority: { type: Number, enum: [1, 2, 3], default: 1 },
  // ADDED: Field to store image URL
  imageUrl: { type: String, default: null } 
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);