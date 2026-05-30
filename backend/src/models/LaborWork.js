const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  labor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  village: { type: String, required: true },
  mandal: { type: String, required: true },
  workType: { type: String, required: true },
  workDate: { type: Date, required: true },
  duration: {
    type: String,
    enum: ['half_day', 'full_day'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

workSchema.index({ labor: 1, workDate: -1 });
workSchema.index({ farmer: 1, workDate: -1 });

module.exports = mongoose.model('LaborWork', workSchema);