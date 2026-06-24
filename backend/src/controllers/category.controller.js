const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

exports.createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).populate('parent', 'name').sort({ order: 1 });
    res.json(new ApiResponse(200, categories, 'Categories fetched'));
});

exports.getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new ApiError(404, 'Category not found');
    res.json(new ApiResponse(200, category, 'Category fetched'));
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(new ApiResponse(200, category, 'Category updated'));
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json(new ApiResponse(200, null, 'Category deleted'));
});