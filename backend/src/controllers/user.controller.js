const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');

exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -otp');
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'Profile fetched'));
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const { fullName, name, phone } = req.body;
    const updates = {};

    if (fullName) updates.name = fullName;
    else if (name) updates.name = name;
    
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
        req.user._id, 
        updates, 
        { new: true, runValidators: true }
    ).select('-password -otp');

    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'Profile updated successfully'));
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Current and new password are required');
    }

    // Retrieve user including password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new ApiError(404, 'User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, 'Incorrect current password');
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, 'New password must be at least 6 characters long');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json(new ApiResponse(200, null, 'Password changed successfully'));
});

exports.getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (search) {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ];
    }

    const users = await User.find(filter)
        .select('-password -otp')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    
    res.json(new ApiResponse(200, {
        users,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
    }, 'Users fetched'));
});

exports.toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');

    // Simulate toggling status or active flag
    user.isVerified = !user.isVerified; // or active flag if added later
    await user.save();

    res.json(new ApiResponse(200, user, 'User status updated'));
});