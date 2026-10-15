const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// CORS - specific origins, no wildcard
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Storefront routers
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const couponRoutes = require('./routes/coupon.routes');
const blogRoutes = require('./routes/blog.routes');

// Admin routers
const adminAnalyticsRoutes = require('./routes/admin/analytics.routes');
const adminDashboardRoutes = require('./routes/admin/dashboard.routes');
const adminDeliveryRoutes = require('./routes/admin/delivery.routes');
const adminOrderRoutes = require('./routes/admin/order.routes');
const adminProductRoutes = require('./routes/admin/product.routes');
const adminReviewRoutes = require('./routes/admin/review.routes');
const adminSettingsRoutes = require('./routes/admin/settings.routes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Admin namespace
app.use('/api/v1/admin', adminDashboardRoutes);
app.use('/api/v1/admin/orders', adminOrderRoutes);
app.use('/api/v1/admin/products', adminProductRoutes);
app.use('/api/v1/admin/reviews', adminReviewRoutes);
app.use('/api/v1/admin/settings', adminSettingsRoutes);
app.use('/api/v1/admin/delivery', adminDeliveryRoutes);
app.use('/api/v1/analytics', adminAnalyticsRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({ success: true, message: 'Server running', time: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
});

module.exports = app;