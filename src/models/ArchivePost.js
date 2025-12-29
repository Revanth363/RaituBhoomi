const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedReason: { type: String }
});

postSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ArchivePost', postSchema);