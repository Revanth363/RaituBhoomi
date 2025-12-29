const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  requirement: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LaborRequirement', 
    required: true 
  },
  labor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  confirmed: { type: Boolean, default: false },
  agreedAt: { type: Date, default: Date.now }
});

// Prevent one labor agreeing twice to same requirement
agreementSchema.index({ requirement: 1, labor: 1 }, { unique: true });

module.exports = mongoose.model('LaborAgreement', agreementSchema);