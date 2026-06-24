const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

exports.createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, order, 'Order placed'));
});

exports.getOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getOrders(req.user._id, req.query);
    res.json(new ApiResponse(200, result, 'Orders fetched'));
});

exports.getOrder = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user._id);
    res.json(new ApiResponse(200, order, 'Order fetched'));
});

exports.cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const order = await orderService.cancelOrder(req.params.id, req.user._id, reason);
    res.json(new ApiResponse(200, order, 'Order cancelled'));
});