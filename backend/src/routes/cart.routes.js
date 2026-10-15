const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, cartController.getCart)
    .post(protect, cartController.addToCart)
    .delete(protect, cartController.clearCart);

router.route('/:productId')
    .put(protect, cartController.updateCartItem)
    .delete(protect, cartController.removeFromCart);

// Coupon support
router.post('/coupon', protect, cartController.applyCoupon);

module.exports = router;