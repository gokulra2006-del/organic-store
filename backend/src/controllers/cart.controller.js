const cartService = require('../services/cart.service');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

exports.getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    res.json(new ApiResponse(200, cart, 'Cart fetched'));
});

exports.addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId) throw new ApiError(400, 'Product ID required');
    const cart = await cartService.addToCart(req.user._id, productId, quantity || 1);
    res.json(new ApiResponse(200, cart, 'Added to cart'));
});

exports.updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    if (quantity === undefined) throw new ApiError(400, 'Quantity required');
    const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
    res.json(new ApiResponse(200, cart, 'Cart updated'));
});

exports.removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(req.user._id, productId);
    res.json(new ApiResponse(200, cart, 'Removed from cart'));
});

exports.clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    res.json(new ApiResponse(200, cart, 'Cart cleared'));
});

exports.applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) throw new ApiError(400, 'Coupon code required');

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) throw new ApiError(404, 'Invalid or expired coupon');

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
        throw new ApiError(400, 'Coupon is not active today');
    }

    const cart = await cartService.getCart(req.user._id);
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (subtotal < coupon.minOrderValue) {
        throw new ApiError(400, `Minimum order value of $${coupon.minOrderValue} required to use this coupon`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
        discount = subtotal * (coupon.discountValue / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
    } else if (coupon.discountType === 'fixed') {
        discount = coupon.discountValue;
    }

    // Update cart
    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { coupon: coupon._id, couponDiscount: discount },
        { new: true }
    ).populate('items.product');

    res.json(new ApiResponse(200, updatedCart, 'Coupon applied successfully'));
});