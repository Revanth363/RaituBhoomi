const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  village: { type: String, required: true },
  mandal: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true, default: 'Andhra Pradesh' },
  role: {
    type: String,
    enum: ['farmer', 'labor', 'admin'],
    required: true
  },
  willingTravel: {
    type: String,
    enum: ['same_village', 'nearby_villages', 'mandal_level'],
    default: null
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.index({ district: 1, mandal: 1, village: 1 });
userSchema.index({ role: 1, mandal: 1, willingTravel: 1 });

module.exports = mongoose.model('User', userSchema);