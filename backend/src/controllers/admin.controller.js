const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

exports.getOverviewStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    
    const revenueData = await Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    
    res.json(new ApiResponse(200, {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: revenueData[0]?.total || 0
    }, 'Admin overview stats fetched'));
});

exports.getActivityLog = asyncHandler(async (req, res) => {
    // Generate recent audit logs based on actual orders and product creation
    const recentOrders = await Order.find()
        .populate('user', 'fullName name')
        .sort({ createdAt: -1 })
        .limit(10);

    const logs = recentOrders.map(order => ({
        id: order._id,
        action: `Order ${order.orderNumber} placed`,
        user: order.user?.fullName || order.user?.name || 'Customer',
        timestamp: order.createdAt,
        type: 'order'
    }));

    res.json(new ApiResponse(200, logs, 'Activity logs fetched'));
});
