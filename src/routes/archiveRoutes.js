// routes/archiveRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createPost, getPosts } = require('../controllers/archiveController');

// Public route - get approved posts
router.get('/posts', getPosts);

// Protected route - farmer only
router.use(auth);
router.use(roleCheck(['farmer']));

// Create post (now accepts base64 images directly)
router.post('/posts', createPost);

module.exports = router;