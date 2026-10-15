const analyticsService = require('../../services/analytics.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

exports.getSalesChart = asyncHandler(async (req, res) => {
    const { days, range } = req.query;
    
    let daysNum = 7;
    if (range) {
        const rangeMap = { '7d': 7, '30d': 30, '180d': 180, '365d': 365 };
        daysNum = rangeMap[range] || 7;
    } else if (days) {
        daysNum = parseInt(days);
    }

    const data = await analyticsService.getSalesChart(daysNum);
    res.json(new ApiResponse(200, data, 'Sales chart fetched'));
});

exports.getTopProducts = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const products = await analyticsService.getTopProducts(limit);
    res.json(new ApiResponse(200, products, 'Top products fetched'));
});

exports.getOrderStats = asyncHandler(async (req, res) => {
    const Order = require('../../models/Order');
    const stats = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(new ApiResponse(200, stats, 'Order stats fetched'));
});