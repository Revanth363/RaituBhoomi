// src/controllers/archiveController.js
const ArchivePost = require('../models/ArchivePost');

// Helper: Validate base64 image string
const isValidBase64Image = (str) => {
  if (typeof str !== 'string') return false;
  const regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$/i;
  return regex.test(str);
};

// Create new archive post (farmer only)
exports.createPost = async (req, res) => {
  try {
    const { content, images = [] } = req.body;

    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    // Validate number of images
    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images are allowed'
      });
    }

    // Validate each image is proper base64
    if (images.length > 0) {
      const invalidImages = images.filter(img => !isValidBase64Image(img));
      if (invalidImages.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'One or more images are in invalid format. Please upload valid images.'
        });
      }
    }

    // Create the post
    const post = await ArchivePost.create({
      farmer: req.user._id,
      content: content.trim(),
      images: images, // Store base64 strings directly
      status: 'pending'
    });

    // Populate farmer info for response
    const populatedPost = await ArchivePost.findById(post._id)
      .populate('farmer', 'fullName village mandal');

    res.status(201).json({
      success: true,
      message: 'Your experience has been submitted for review',
      post: populatedPost
    });

  } catch (error) {
    console.error('Create archive post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit post. Please try again later.'
    });
  }
};

// Get all approved posts (public - no auth needed)
exports.getPosts = async (req, res) => {
  try {
    const { crop, village } = req.query;

    let query = { status: 'approved' };

    // Text search in content for crop name
    if (crop) {
      query.content = { $regex: crop.trim(), $options: 'i' };
    }

    let posts = await ArchivePost.find(query)
      .populate('farmer', 'fullName village mandal')
      .sort({ approvedAt: -1, createdAt: -1 })
      .lean(); // Use lean for better performance when filtering

    // Filter by village if provided (case-insensitive partial match)
    if (village) {
      const lowerVillage = village.toLowerCase();
      posts = posts.filter(post =>
        post.farmer?.village?.toLowerCase().includes(lowerVillage)
      );
    }

    res.json(posts);

  } catch (error) {
    console.error('Get archive posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};