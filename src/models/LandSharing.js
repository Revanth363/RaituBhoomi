const mongoose = require('mongoose');

const sharingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cultivator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop: { type: String, required: true },
  area: { type: String, required: true },
  year: { type: Number, required: true },
  // NEW: Link to cultivator's season
  cultivatorSeason: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerSeason' },
  expectedBags: { type: Number },
  expectedPricePerBag: { type: Number },
  givenBags: { type: Number },
  givenAmount: { type: Number },
  paymentCompleted: { type: Boolean, default: false },
paymentCompletedAt: { type: Date },
  agreedByBoth: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

sharingSchema.index({ owner: 1, year: 1 });
sharingSchema.index({ cultivator: 1, year: 1 });

module.exports = mongoose.model('LandSharing', sharingSchema);