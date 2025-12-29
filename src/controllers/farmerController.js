const FarmerSeason = require('../models/FarmerSeason');
const YieldRecord = require('../models/YieldRecord');
const LaborRequirement = require('../models/LaborRequirement');
const LandSharing = require('../models/LandSharing');
const LaborAgreement = require('../models/LaborAgreement');
const LaborWork = require('../models/LaborWork');
const User = require('../models/User');

// Create new season
exports.createSeason = async (req, res) => {
  try {
    const seasonData = {
      ...req.body,
      farmer: req.user._id
    };

    const season = await FarmerSeason.create(seasonData);

    res.status(201).json({
      success: true,
      season
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create season'
    });
  }
};

// Get all seasons for farmer
exports.getSeasons = async (req, res) => {
  try {
    const seasons = await FarmerSeason.find({ farmer: req.user._id })
      .populate({
        path: 'landSharing',
        populate: {
          path: 'owner',
          select: 'fullName village phone'
        }
      })
      .sort({ year: -1, createdAt: -1 });

    res.json(seasons);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seasons'
    });
  }
};

// Get single season
exports.getSeasonById = async (req, res) => {
  try {
    const season = await FarmerSeason.findOne({
      _id: req.params.seasonId,
      farmer: req.user._id
    });

    if (!season) {
      return res.status(404).json({
        success: false,
        message: 'Season not found'
      });
    }

    res.json(season);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch season'
    });
  }
};

// Update season
exports.updateSeason = async (req, res) => {
  try {
    const season = await FarmerSeason.findOneAndUpdate(
      { _id: req.params.seasonId, farmer: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!season) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this season'
      });
    }

    res.json(season);
  } catch (error) {
    console.error('Update season error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Create yield record
exports.createYieldRecord = async (req, res) => {
  try {
    const yieldData = {
      ...req.body,
      farmer: req.user._id
    };

    const yieldRecord = await YieldRecord.create(yieldData);

    // Populate season for response
    const populated = await YieldRecord.findById(yieldRecord._id)
      .populate('season', 'crop year');

    res.status(201).json({
      success: true,
      yieldRecord: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create yield record'
    });
  }
};

// Get all yield records
exports.getYieldRecords = async (req, res) => {
  try {
    const yields = await YieldRecord.find({ farmer: req.user._id })
      .populate('season', 'crop year fieldArea totalInvestment')
      .sort({ year: -1 });

    res.json(yields);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield records'
    });
  }
};

// Create labor requirement
exports.createLaborRequirement = async (req, res) => {
  try {
    const requirementData = {
      ...req.body,
      farmer: req.user._id
    };

    const requirement = await LaborRequirement.create(requirementData);

    res.status(201).json({
      success: true,
      requirement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create labor requirement'
    });
  }
};

// Get farmer's labor requirements with confirmed laborers
// controllers/farmerController.js
// controllers/farmerController.js
exports.getLaborRequirements = async (req, res) => {
  try {
    const requirements = await LaborRequirement.find({ farmer: req.user._id })
      .sort({ requiredDate: -1 });

    const populated = await Promise.all(
      requirements.map(async (reqItem) => {
        // Get all agreements for this requirement
        const agreements = await LaborAgreement.find({ requirement: reqItem._id })
          .populate('labor', 'fullName village mandal phone');

        // Build detailed info for each labor
        const laborersWithDetails = await Promise.all(
          agreements.map(async (agreement) => {
            const labor = agreement.labor;

            // Past work stats
            const totalDays = await LaborWork.countDocuments({ labor: labor._id });
            const farmersWorked = await LaborWork.distinct('farmer', { labor: labor._id })
              .then(arr => arr.length);
            const villagesWorked = await LaborWork.distinct('village', { labor: labor._id })
              .then(arr => arr.length);

            // Check if work already recorded for this specific job
            const workRecorded = await LaborWork.findOne({
              labor: labor._id,
              farmer: req.user._id,
              workDate: reqItem.requiredDate,
              workType: reqItem.workType
            });

            return {
              _id: labor._id,
              fullName: labor.fullName,
              village: labor.village,
              mandal: labor.mandal,
              phone: agreement.confirmed ? labor.phone : 'Hidden until confirmed',
              agreementId: agreement._id,
              confirmed: agreement.confirmed || false,
              workRecorded: !!workRecorded,  // ← THIS IS THE FLAG
              stats: {
                totalDays,
                farmersWorked,
                villagesWorked
              }
            };
          })
        );

        // Split into interested (not confirmed) and confirmed
        const interestedLaborers = laborersWithDetails.filter(l => !l.confirmed);
        const confirmedLaborers = laborersWithDetails.filter(l => l.confirmed);

        return {
          ...reqItem.toObject(),
          interestedLaborers,
          confirmedLaborers,
          acceptedCount: confirmedLaborers.length  // Only confirmed count as filled
        };
      })
    );

    res.json(populated);
  } catch (error) {
    console.error('Error fetching labor requirements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requirements' });
  }
};

// controllers/farmerController.js
exports.confirmLabor = async (req, res) => {
  try {
    const agreementId = req.params.agreementId;
    const farmerId = req.user._id;

    // Find the agreement with populated requirement and labor
    const agreement = await LaborAgreement.findById(agreementId)
      .populate({
        path: 'requirement',
        select: 'farmer numberOfPeople acceptedCount active'
      })
      .populate({
        path: 'labor',
        select: 'fullName village mandal phone'
      });

    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    // Authorization: Only the farmer who created the requirement can confirm
    if (agreement.requirement.farmer.toString() !== farmerId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to confirm this labor' });
    }

    // Prevent double confirmation
    if (agreement.confirmed) {
      return res.status(400).json({ success: false, message: 'This labor has already been confirmed' });
    }

    // Mark agreement as confirmed
    agreement.confirmed = true;
    await agreement.save();

    // Increment acceptedCount on the requirement
    const updatedRequirement = await LaborRequirement.findByIdAndUpdate(
      agreement.requirement._id,
      { $inc: { acceptedCount: 1 } },
      { new: true }
    );

    // If all slots are now filled, deactivate the requirement
    if (updatedRequirement.acceptedCount >= updatedRequirement.numberOfPeople) {
      await LaborRequirement.findByIdAndUpdate(
        updatedRequirement._id,
        { active: false }
      );
    }

    res.json({
      success: true,
      message: 'Labor successfully confirmed',
      data: {
        labor: agreement.labor,
        acceptedCount: updatedRequirement.acceptedCount,
        totalNeeded: updatedRequirement.numberOfPeople,
        isFull: updatedRequirement.acceptedCount >= updatedRequirement.numberOfPeople
      }
    });

  } catch (error) {
    console.error('Error confirming labor:', error);
    res.status(500).json({ success: false, message: 'Server error while confirming labor' });
  }
};

// Delete labor requirement
exports.deleteLaborRequirement = async (req, res) => {
  try {
    const requirement = await LaborRequirement.findOneAndDelete({
      _id: req.params.requirementId,
      farmer: req.user._id
    });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found'
      });
    }

    res.json({
      success: true,
      message: 'Requirement deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete requirement'
    });
  }
};

// Create land sharing agreement
exports.createLandSharing = async (req, res) => {
  try {
    const sharingData = {
      ...req.body,
      owner: req.user._id
    };

    const sharing = await LandSharing.create(sharingData);

    // Populate both users
    const populated = await LandSharing.findById(sharing._id)
      .populate('owner', 'fullName village mandal')
      .populate('cultivator', 'fullName village mandal');

    res.status(201).json({
      success: true,
      sharing: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create land sharing'
    });
  }
};

exports.getLandSharings = async (req, res) => {
  try {
    const sharings = await LandSharing.find({
      $or: [
        { owner: req.user._id },
        { cultivator: req.user._id }
      ]
    })
      .populate('owner', 'fullName village mandal phone')
      .populate('cultivator', 'fullName village mandal phone')
      .populate({
  path: 'cultivatorSeason',
  populate: {
    path: 'yieldRecord',
    model: 'YieldRecord',
    select: 'totalBags pricePerBag totalAmount'
  }
})

      .sort({ year: -1 });

    console.log(
  'DEBUG FIRST SHARING:',
  JSON.stringify(sharings[0], null, 2)
);


    res.json(sharings);
  } catch (error) {
    console.error('Get land sharings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch land sharings'
    });
  }
};


// Approve land sharing (toggle agreement)
exports.approveLandSharing = async (req, res) => {
  try {
    const sharing = await LandSharing.findById(req.params.sharingId);

    if (!sharing) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    // User must be either owner or cultivator
    if (sharing.owner.toString() !== req.user._id.toString() &&
        sharing.cultivator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Toggle agreement - both must approve
    if (sharing.agreedByBoth) {
      return res.status(400).json({
        success: false,
        message: 'Already agreed by both parties'
      });
    }

    // Mark as agreed if both have approved
    const isOwner = sharing.owner.toString() === req.user._id.toString();
    const isCultivator = sharing.cultivator.toString() === req.user._id.toString();

    if (isOwner && isCultivator) {
      sharing.agreedByBoth = true;
    } else {
      // In real app, track who approved - simplified here
      sharing.agreedByBoth = true; // Since only two parties
    }

    await sharing.save();

    const populated = await LandSharing.findById(sharing._id)
      .populate('owner', 'fullName')
      .populate('cultivator', 'fullName');

    res.json({
      success: true,
      sharing: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve agreement'
    });
  }
};

// Record actual work done by a laborer (after agreement)
exports.recordActualWork = async (req, res) => {
  try {
    const { agreementId, duration, amountPaid } = req.body;

    if (!agreementId || !duration || !amountPaid || amountPaid <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data: agreementId, duration, and amountPaid are required'
      });
    }

    // Find the agreement
    const agreement = await LaborAgreement.findById(agreementId);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    // Load requirement and its farmer separately for safety
    const requirement = await LaborRequirement.findById(agreement.requirement)
      .populate('farmer', '_id');

    if (!requirement || !requirement.farmer) {
      return res.status(404).json({
        success: false,
        message: 'Requirement or farmer not found'
      });
    }

    // AUTHORIZATION: Only the farmer who created the requirement can record work
    if (requirement.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to record work for this requirement'
      });
    }

    // Load labor details
    const labor = await User.findById(agreement.labor)
      .select('fullName village mandal phone');

    // Prevent duplicate work record
    const existingWork = await LaborWork.findOne({
      labor: agreement.labor,
      farmer: req.user._id,
      workDate: requirement.requiredDate,
      workType: requirement.workType
    });

    if (existingWork) {
      return res.status(400).json({
        success: false,
        message: 'Work already recorded for this laborer on this date'
      });
    }

    // Create the work record
    const workRecord = await LaborWork.create({
      labor: agreement.labor,
      farmer: req.user._id,
      village: requirement.village,
      mandal: requirement.mandal,
      workType: requirement.workType,
      workDate: requirement.requiredDate,
      duration
    });

    // Update farmer's current active season labor cost
    const currentYear = new Date().getFullYear();
    const currentSeason = await FarmerSeason.findOne({
      farmer: req.user._id,
      year: currentYear,
      harvestDate: null  // active season
    });

    if (currentSeason) {
      currentSeason.totalLaborCost = (currentSeason.totalLaborCost || 0) + Number(amountPaid);
      await currentSeason.save();
    }

    res.json({
      success: true,
      message: 'Work recorded successfully',
      workRecord: {
        ...workRecord.toObject(),
        labor: labor,
        farmer: { fullName: req.user.fullName }
      },
      updatedLaborCost: currentSeason ? currentSeason.totalLaborCost : 0
    });

  } catch (error) {
    console.error('Record work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording work'
    });
  }
};

// Update Farmer Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, village, mandal, district, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields if provided
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (village) user.village = village;
    if (mandal) user.mandal = mandal;
    if (district) user.district = district;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword; // pre-save hook will hash it
    }

    await user.save();

    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Farmer Account (with full data cleanup)
exports.deleteAccount = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Delete all related data
    await FarmerSeason.deleteMany({ farmer: farmerId });
    await YieldRecord.deleteMany({ farmer: farmerId });
    await LaborRequirement.deleteMany({ farmer: farmerId });
    await LandSharing.deleteMany({
      $or: [{ owner: farmerId }, { cultivator: farmerId }]
    });
    await LaborAgreement.deleteMany({
      $or: [{ labor: farmerId }, { farmer: farmerId }]
    });
    await LaborWork.deleteMany({
      $or: [{ labor: farmerId }, { farmer: farmerId }]
    });

    // Finally delete the user
    await User.findByIdAndDelete(farmerId);

    res.json({ success: true, message: 'Account and all related data deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/farmerController.js
exports.recordHarvest = async (req, res) => {
  try {
    const season = await FarmerSeason.findOne({
      _id: req.params.seasonId,
      farmer: req.user._id,
      harvestDate: null
    });

    if (!season) {
      return res.status(404).json({ message: 'Season not found or already harvested' });
    }

    const { totalBags, weightPerBag, pricePerBag } = req.body;

    if (!totalBags || totalBags <= 0) {
      return res.status(400).json({ message: 'Total bags must be a positive number' });
    }
    if (!pricePerBag || pricePerBag <= 0) {
      return res.status(400).json({ message: 'Price per bag must be a positive number' });
    }

    const calculatedTotalAmount = Number(totalBags) * Number(pricePerBag);

    // Update season fields
    season.harvestDate = req.body.harvestDate || new Date();
    season.totalBags = Number(totalBags);
    season.weightPerBag = Number(weightPerBag) || 83;
    season.pricePerBag = Number(pricePerBag);
    season.totalAmountReceived = calculatedTotalAmount;

    // Create YieldRecord
    const yieldRecord = await YieldRecord.create({
      farmer: req.user._id,
      season: season._id,
      year: season.year,
      totalBags: season.totalBags,
      weightPerBag: season.weightPerBag,
      pricePerBag: season.pricePerBag,
      totalAmount: season.totalAmountReceived,
      harvestCompletionDate: season.harvestDate,
      createdAt: new Date()
    });

    // Link yieldRecord to season
    season.yieldRecord = yieldRecord._id;

    // Save season ONCE, at the end
    await season.save();

    const populatedYield = await YieldRecord.findById(yieldRecord._id)
      .populate('season', 'crop year fieldArea totalInvestment');

    res.json({
      success: true,
      message: 'Harvest recorded and yield summary updated',
      season,
      yieldRecord: populatedYield
    });
  } catch (error) {
    console.error('Record harvest error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to record harvest',
      error: error.message 
    });
  }
};

// controllers/farmerController.js

exports.deleteSeason = async (req, res) => {
  try {
    const season = await FarmerSeason.findOneAndDelete({
      _id: req.params.seasonId,
      farmer: req.user._id
    });

    if (!season) {
      return res.status(404).json({
        success: false,
        message: 'Season not found or not owned by you'
      });
    }

    res.json({
      success: true,
      message: 'Season deleted successfully'
    });
  } catch (error) {
    console.error('Delete season error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete season'
    });
  }
};

// Create land sharing agreement (Owner initiates)
exports.createLandSharing = async (req, res) => {
  try {
    const { cultivatorPhone, crop, area, year, expectedBags, expectedPricePerBag } = req.body;

    if (!cultivatorPhone || !crop || !area || !year) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Find cultivator by phone
    const cultivator = await User.findOne({ phone: cultivatorPhone, role: 'farmer' });
    if (!cultivator) {
      return res.status(404).json({ success: false, message: 'Farmer with this phone not found' });
    }

    if (cultivator._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot share land with yourself' });
    }

    const sharing = await LandSharing.create({
      owner: req.user._id,
      cultivator: cultivator._id,
      crop,
      area,
      year,
      expectedBags: expectedBags ? Number(expectedBags) : undefined,
      expectedPricePerBag: expectedPricePerBag ? Number(expectedPricePerBag) : undefined,
      agreedByBoth: false
    });

    const populated = await LandSharing.findById(sharing._id)
      .populate('owner cultivator', 'fullName village mandal phone');

    res.status(201).json({ success: true, sharing: populated });
  } catch (error) {
    console.error('Create land sharing error:', error);
    res.status(500).json({ success: false, message: 'Failed to create agreement' });
  }
};

// Accept land sharing agreement (Cultivator confirms)
exports.acceptLandSharing = async (req, res) => {
  try {
    const sharing = await LandSharing.findById(req.params.sharingId);

    if (!sharing) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    if (sharing.cultivator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (sharing.agreedByBoth) {
      return res.status(400).json({ success: false, message: 'Already accepted' });
    }

    sharing.agreedByBoth = true;
    await sharing.save();

    const populated = await LandSharing.findById(sharing._id)
      .populate('owner cultivator', 'fullName village mandal');

    res.json({ success: true, sharing: populated });
  } catch (error) {
    console.error('Accept land sharing error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept agreement' });
  }
};


exports.linkSeasonToSharing = async (req, res) => {
  try {
    const { seasonId, sharingId } = req.body;

    if (!seasonId || !sharingId) {
      return res.status(400).json({ message: 'Missing IDs' });
    }

    const season = await FarmerSeason.findById(seasonId);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    if (season.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your season' });
    }

    if (season.landSharing) {
      return res.status(400).json({ message: 'Season already linked' });
    }

    const sharing = await LandSharing.findById(sharingId);
    if (!sharing) {
      return res.status(404).json({ message: 'Land sharing not found' });
    }

    if (!sharing.agreedByBoth) {
      return res.status(400).json({ message: 'Agreement not confirmed' });
    }

    if (sharing.cultivator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not the cultivator' });
    }

    if (sharing.year !== season.year) {
      return res.status(400).json({ message: 'Year mismatch' });
    }

    // ✅ CRITICAL FIX
    const normalize = (v) => v?.trim().toLowerCase();
    if (normalize(sharing.crop) !== normalize(season.crop)) {
      return res.status(400).json({
        message: 'Season crop does not match land sharing crop'
      });
    }

    if (sharing.cultivatorSeason) {
      return res.status(400).json({ message: 'Already linked' });
    }

    season.landSharing = sharing._id;
    sharing.cultivatorSeason = season._id;

    await season.save();
    await sharing.save();

    res.json({
      success: true,
      message: 'Season successfully linked'
    });

  } catch (err) {
    console.error('LINK ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateLandSharingSettlement = async (req, res) => {
  try {
    const { givenBags, givenAmount } = req.body;
    const sharingId = req.params.sharingId;

    const sharing = await LandSharing.findById(sharingId);

    if (!sharing) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    // Allow BOTH owner AND cultivator to update settlement
    // (Cultivator reports actual yield → auto-updates givenBags/givenAmount)
    const userId = req.user._id.toString();
    const isOwner = sharing.owner.toString() === userId;
    const isCultivator = sharing.cultivator.toString() === userId;

    if (!isOwner && !isCultivator) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields if provided
    if (givenBags !== undefined) {
      sharing.givenBags = Number(givenBags);
    }
    if (givenAmount !== undefined) {
      sharing.givenAmount = Number(givenAmount);
    }

    await sharing.save();

    // Return updated sharing with populated users
    const populated = await LandSharing.findById(sharingId)
      .populate('owner cultivator', 'fullName phone');

    res.json({
      success: true,
      message: 'Settlement updated successfully',
      sharing: populated
    });
  } catch (error) {
    console.error('Update settlement error:', error);
    res.status(500).json({ message: 'Failed to update settlement' });
  }
};

exports.markPaymentComplete = async (req, res) => {
  try {
    const sharing = await LandSharing.findById(req.params.sharingId)
      .populate('cultivator', '_id');

    if (!sharing) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    // Only cultivator can mark payment as completed
    if (sharing.cultivator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (sharing.paymentCompleted) {
      return res.status(400).json({ message: 'Payment already marked as completed' });
    }

    sharing.paymentCompleted = true;
    sharing.paymentCompletedAt = new Date();
    await sharing.save();

    res.json({ success: true, message: 'Payment marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};