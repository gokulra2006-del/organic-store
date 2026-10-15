const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// Customer endpoints
router.route('/')
    .post(protect, orderController.createOrder)
    .get(protect, orderController.getOrders);

router.route('/verify-payment')
    .post(protect, orderController.verifyPayment);

router.route('/:id')
    .get(protect, orderController.getOrder);

router.route('/:id/cancel')
    .put(protect, orderController.cancelOrder)
    .patch(protect, orderController.cancelOrder); // Support both PATCH and PUT

// Admin endpoints (mapping calls from frontend api.js)
router.route('/admin')
    .get(protect, requireAdmin, orderController.getAllOrders);

router.route('/:id/status')
    .put(protect, requireAdmin, orderController.updateOrderStatus)
    .patch(protect, requireAdmin, orderController.updateOrderStatus); // Support both PATCH and PUT

module.exports = router;