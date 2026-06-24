const Review = require('../../models/Review');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

exports.getAllReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const reviews = await Review.find().populate('user', 'fullName').populate('product', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Review.countDocuments();
    res.json(new ApiResponse(200, { reviews, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Reviews fetched'));
});

exports.toggleReviewStatus = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    review.isActive = !review.isActive;
    await review.save();
    res.json(new ApiResponse(200, review, 'Review status toggled'));
});