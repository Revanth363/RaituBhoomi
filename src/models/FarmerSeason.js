const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  crop: { type: String, required: true, default: 'Paddy' },
  fieldArea: { type: String },
  preparationDate: { type: Date },
  ploughingDates: [{ type: Date }],
  sowingDate: { type: Date },
  transplantingDate: { type: Date },
  weedingDates: [{ type: Date }],
  pesticideUses: [{
    date: { type: Date },
    type: { type: String },
    cost: { type: Number }
  }],
  machineryUses: [{
    date: { type: Date },
    machine: { type: String },
    duration: { type: String },
    cost: { type: Number }
  }],
  harvestDate: { type: Date },
  totalLaborCost: { type: Number, default: 0 },
  totalMachineryCost: { type: Number, default: 0 },
  totalInvestment: { type: Number, default: 0 },
  // NEW: Link to land sharing agreement
  yieldRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'YieldRecord' },
  landSharing: { type: mongoose.Schema.Types.ObjectId, ref: 'LandSharing' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

seasonSchema.index({ farmer: 1, year: 1 });
seasonSchema.index({ farmer: 1, crop: 1, year: 1 });

module.exports = mongoose.model('FarmerSeason', seasonSchema);