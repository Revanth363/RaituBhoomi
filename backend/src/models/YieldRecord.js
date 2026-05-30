const mongoose = require('mongoose');

const yieldSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerSeason', required: true },
  year: { type: Number, required: true },
  totalBags: { type: Number, required: true },
  weightPerBag: { type: Number, default: 83 },
  pricePerBag: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  harvestCompletionDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

yieldSchema.index({ farmer: 1, year: 1 });
yieldSchema.index({ season: 1 });

module.exports = mongoose.model('YieldRecord', yieldSchema);