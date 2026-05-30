const User = require('../models/User');
const LaborRequirement = require('../models/LaborRequirement');
const LaborWork = require('../models/LaborWork');
const LaborAgreement = require('../models/LaborAgreement'); // ← Add this import
const mongoose = require('mongoose'); // ← Needed for ObjectId queries

// Update labor availability (willingTravel)
exports.updateAvailability = async (req, res) => {
  try {
    const { willingTravel } = req.body;

    if (!['same_village', 'nearby_villages', 'mandal_level'].includes(willingTravel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid travel range'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { willingTravel },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update availability'
    });
  }
};

// Get available labor requirements (only with open slots)
exports.getAvailableRequirements = async (req, res) => {
  try {
    const labor = req.user;

    let query = { 
      active: true,
      $expr: { $lt: ['$acceptedCount', '$numberOfPeople'] } // ← Correct way
    };

    if (labor.willingTravel === 'same_village') {
      query.village = labor.village;
      query.mandal = labor.mandal;
    } else if (labor.willingTravel === 'nearby_villages') {
      query.mandal = labor.mandal;
    }
    // mandal_level: no extra filter

    const requirements = await LaborRequirement.find(query)
      .populate('farmer', 'fullName village mandal phone')
      .sort({ requiredDate: 1 });

    res.json(requirements);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requirements'
    });
  }
};

// Agree to a labor requirement (book a slot)
// controllers/laborController.js
exports.agreeToRequirement = async (req, res) => {
  try {
    const requirementId = req.params.requirementId;
    const laborId = req.user._id;

    const requirement = await LaborRequirement.findById(requirementId);
    if (!requirement) return res.status(404).json({ success: false, message: 'Not found' });

    if (!requirement.active) return res.status(400).json({ success: false, message: 'No longer active' });

    const existing = await LaborAgreement.findOne({ requirement: requirementId, labor: laborId });
    if (existing) return res.status(400).json({ success: false, message: 'Already agreed' });

    // Just create pending agreement
    await LaborAgreement.create({
      requirement: requirementId,
      labor: laborId,
      confirmed: false
    });

    res.json({ success: true, message: 'Interest recorded. Waiting for farmer to confirm.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Get labor's work history
exports.getWorkHistory = async (req, res) => {
  try {
    const history = await LaborWork.find({ labor: req.user._id })
      .populate('farmer', 'fullName village mandal')
      .sort({ workDate: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work history'
    });
  }
};

// Create work record (after actual work is done)
exports.createWorkRecord = async (req, res) => {
  try {
    const workData = {
      ...req.body,
      labor: req.user._id
    };

    const farmer = await User.findById(workData.farmer);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid farmer'
      });
    }

    const work = await LaborWork.create(workData);

    const populated = await LaborWork.findById(work._id)
      .populate('farmer', 'fullName village mandal');

    res.status(201).json({
      success: true,
      workRecord: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create work record'
    });
  }
};

// Remove or ignore acceptRequirement if not used
// exports.acceptRequirement = ... (you can delete this)