const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createSeason,
  getSeasons,
  getSeasonById,
  updateSeason,
  createYieldRecord,
  getYieldRecords,
  createLaborRequirement,
  getLaborRequirements,
  deleteLaborRequirement,
  createLandSharing,
  getLandSharings,
  acceptLandSharing,
  recordActualWork,
  updateProfile,
  deleteAccount,
  recordHarvest,
  deleteSeason,
  confirmLabor,
  linkSeasonToSharing,
  updateLandSharingSettlement,
  markPaymentComplete,
} = require('../controllers/farmerController');

// All routes require authentication and farmer role
router.use(auth);
router.use(roleCheck(['farmer']));

// Season routes
router.post('/seasons', createSeason);
router.get('/seasons', getSeasons);

router.put('/seasons/link-sharing', linkSeasonToSharing);

router.get('/seasons/:seasonId', getSeasonById);
router.put('/seasons/:seasonId', updateSeason);
router.post('/seasons/:seasonId/harvest', recordHarvest);
router.delete('/seasons/:seasonId', deleteSeason); 


// Yield routes
router.post('/yield', createYieldRecord);
router.get('/yield', getYieldRecords);

// Labor requirements
router.post('/labor-requirements', createLaborRequirement);
router.get('/labor-requirements', getLaborRequirements);
router.delete('/labor-requirements/:requirementId', deleteLaborRequirement);
// farmerRoutes.js
router.post('/labor-agreements/:agreementId/confirm', confirmLabor);

// Land sharing
router.post('/land-sharing', createLandSharing);
router.get('/land-sharing', getLandSharings);
router.put('/land-sharing/:sharingId/accept', acceptLandSharing);
router.put('/land-sharing/:sharingId/settlement', updateLandSharingSettlement);
router.patch('/land-sharing/:sharingId/payment-complete', markPaymentComplete);

// Record actual work done
router.post('/record-work', recordActualWork);

// Profile management
router.put('/profile', updateProfile);     // You'll create this
router.delete('/account', deleteAccount);  // You'll create this

module.exports = router;