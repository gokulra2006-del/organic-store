const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// CORS - specific origins, no wildcard
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Allow localhost or any vercel.app preview/production deployment
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
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

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

// Payment routes
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/v1/payment', paymentRoutes);

// Admin Order Routes
const adminOrderRoutes = require('./routes/admin/order.routes');
app.use('/api/v1/orders/admin', adminOrderRoutes);

// Order routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/v1/orders', orderRoutes);

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