const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  updateAvailability,
  getAvailableRequirements,
  agreeToRequirement,     // ← Fixed function name
  getWorkHistory,
  createWorkRecord
} = require('../controllers/laborController');

// All routes require authentication and labor role
router.use(auth);
router.use(roleCheck(['labor']));

// Availability
router.put('/availability', updateAvailability);

// Requirements
router.get('/requirements', getAvailableRequirements);

// Agree to work (NEW CONSENT-BASED BOOKING)
router.post('/requirements/:requirementId/agree', agreeToRequirement);

// Work history & records
router.get('/work-history', getWorkHistory);
router.post('/work', createWorkRecord);

module.exports = router;