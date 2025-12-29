const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  village: { type: String, required: true },
  mandal: { type: String, required: true },
  workType: { type: String, required: true },
  requiredDate: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true }, // Total slots needed
  dailyWage: { type: Number, required: true },      // NEW: Wage per day
  wageType: { 
    type: String, 
    enum: ['full_day', 'half_day'], 
    default: 'full_day' 
  },                                                // NEW: Optional
  notes: { type: String },
  active: { type: Boolean, default: true },
  acceptedCount: { type: Number, default: 0 },      // NEW: How many agreed
  createdAt: { type: Date, default: Date.now }
});

// Index for real-time queries
requirementSchema.index({ mandal: 1, requiredDate: 1, active: 1, acceptedCount: -1 });

module.exports = mongoose.model('LaborRequirement', requirementSchema);