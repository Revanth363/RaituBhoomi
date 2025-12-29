const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getPendingPosts,
  approvePost,
  rejectPost,
  getAllPosts
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(auth);
router.use(roleCheck(['admin']));

// Pending posts
router.get('/posts/pending', getPendingPosts);

// All posts
router.get('/posts', getAllPosts);

// Approve post
router.put('/posts/:postId/approve', approvePost);

// Reject post
router.put('/posts/:postId/reject', rejectPost);

module.exports = router;