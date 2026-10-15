const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const addressController = require('../controllers/address.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// Profile operations
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

// Address sub-routes
router.route('/addresses')
    .post(protect, addressController.createAddress)
    .get(protect, addressController.getAddresses);

router.route('/addresses/:id')
    .put(protect, addressController.updateAddress)
    .delete(protect, addressController.deleteAddress);

// Admin operations
router.get('/all', protect, requireAdmin, userController.getAllUsers);
router.patch('/:id/toggle-status', protect, requireAdmin, userController.toggleUserStatus);

module.exports = router;