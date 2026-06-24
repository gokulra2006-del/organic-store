const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

class OrderService {
    async createOrder(userId, orderData) {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

        const items = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.images?.[0]?.filename
        }));

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 500 ? 0 : 40;
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + shipping + tax - (cart.couponDiscount || 0);

        const order = await Order.create({
            user: userId,
            items,
            shippingAddress: orderData.shippingAddress,
            pricing: { subtotal, shipping, tax, discount: cart.couponDiscount || 0, total },
            paymentMethod: orderData.paymentMethod || 'cod',
            coupon: cart.coupon,
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
        }

        await Cart.findOneAndUpdate({ user: userId }, { items: [], coupon: null, couponDiscount: 0 });
        return order;
    }

    async getOrders(userId, query = {}) {
        const { page = 1, limit = 10, status } = query;
        const filter = { user: userId };
        if (status) filter.status = status;
        const orders = await Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Order.countDocuments(filter);
        return { orders, total, page: parseInt(page), pages: Math.ceil(total / limit) };
    }

    async getOrderById(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw new ApiError(404, 'Order not found');
        return order;
    }

    async cancelOrder(orderId, userId, reason) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw new ApiError(404, 'Order not found');
        if (order.status !== 'pending' && order.status !== 'confirmed') {
            throw new ApiError(400, 'Order cannot be cancelled');
        }
        order.status = 'cancelled';
        order.cancellationReason = reason;
        await order.save();

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
        return order;
    }

    async getAllOrders(query = {}) {
        const { page = 1, limit = 20, status, search } = query;
        const filter = {};
        if (status) filter.status = status;
        if (search) filter.orderNumber = new RegExp(search, 'i');
        const orders = await Order.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Order.countDocuments(filter);
        return { orders, total, page: parseInt(page), pages: Math.ceil(total / limit) };
    }

    async updateOrderStatus(orderId, status) {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) throw new ApiError(404, 'Order not found');
        return order;
    }
}
module.exports = new OrderService();