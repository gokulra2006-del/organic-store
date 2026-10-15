const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.route('/')
    .post(protect, reviewController.createReview);

router.route('/:productId')
    .get(reviewController.getProductReviews);

router.route('/:id/moderate')
    .put(protect, requireAdmin, reviewController.moderateReview);

module.exports = router;