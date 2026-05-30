const ArchivePost = require('../models/ArchivePost');

// Get pending posts for moderation
exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await ArchivePost.find({ status: 'pending' })
      .populate('farmer', 'fullName village mandal phone')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending posts'
    });
  }
};

// Approve a post
exports.approvePost = async (req, res) => {
  try {
    const post = await ArchivePost.findByIdAndUpdate(
      req.params.postId,
      { 
        status: 'approved',
        approvedAt: new Date()
      },
      { new: true }
    ).populate('farmer', 'fullName village mandal');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve post'
    });
  }
};

// Reject a post
exports.rejectPost = async (req, res) => {
  try {
    const { reason } = req.body;

    const post = await ArchivePost.findByIdAndUpdate(
      req.params.postId,
      { 
        status: 'rejected',
        rejectedReason: reason || 'Does not meet guidelines'
      },
      { new: true }
    ).populate('farmer', 'fullName village mandal');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject post'
    });
  }
};

// Get all posts (approved, pending, rejected) - for admin overview
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await ArchivePost.find({})
      .populate('farmer', 'fullName village mandal')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};