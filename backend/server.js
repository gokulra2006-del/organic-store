const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // MUST BE FIRST - before any other imports

const connectDB = require('./src/config/db');
const app = require('./src/app');
const http = require('http');
const socketIO = require('socket.io');

// Connect to database
connectDB();

const PORT = 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }
});

// Store io instance on app
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (data) => {
        const { userId, role } = data;
        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined room user_${userId}`);
        }
        if (role === 'admin' || role === 'superadmin') {
            socket.join('admins');
            console.log(`Admin joined admins room`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Start listening
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.warn(`Unhandled Rejection: ${err.message}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.warn(`Uncaught Exception: ${err.message}`);
});