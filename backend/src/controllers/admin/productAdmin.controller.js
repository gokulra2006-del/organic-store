const productService = require('../../services/product.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

exports.getAllProducts = asyncHandler(async (req, res) => {
    const Product = require('../../models/Product');
    const { page = 1, limit = 20, search, status } = req.query;
    const filter = {};
    if (status !== undefined) filter.isActive = status === 'active';
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { sku: new RegExp(search, 'i') }];
    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);
    res.json(new ApiResponse(200, { products, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Products fetched'));
});

exports.toggleProductStatus = asyncHandler(async (req, res) => {
    const Product = require('../../models/Product');
    const product = await Product.findById(req.params.id);
    product.isActive = !product.isActive;
    await product.save();
    res.json(new ApiResponse(200, product, 'Product status toggled'));
});