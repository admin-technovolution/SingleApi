const mongoose = require('mongoose');
const path = require('path');
const logger = require('../config/logger');
const filename = path.basename(__filename);
let reconnectAttempt = 0;
let isConnecting = false;

const connectWithRetry = () => {
    if (isConnecting) return;
    isConnecting = true;
    reconnectAttempt++;
    const delay = Math.min(reconnectAttempt * 1000, 5000);
    logger.info(`Attempting to reconnect to Mongo, attempt #${reconnectAttempt}`, { className: filename });

    setTimeout(() => {
        mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: process.env.MONGO_SOCKET_TIMEOUT_MS,
            maxPoolSize: process.env.MONGO_MAX_POOL_SIZE,
            minPoolSize: process.env.MONGO_MIN_POOL_SIZE,
            connectTimeoutMS: process.env.MONGO_CONNECTION_TIMEOUT_MS,
            heartbeatFrequencyMS: process.env.MONGO_HEARTBEAT_FREQUENCY_MS,
            retryWrites: process.env.MONGO_RETRY_WRITES
        })
            .then(() => {
                isConnecting = false;
            })
            .catch(err => {
                isConnecting = false;
                logger.error('MongoDB attempting to reconnect. MongoDB connection error:', err, { className: filename });
                connectWithRetry();
            });
    }, delay);
};

mongoose.connection.on('connected', () => {
    reconnectAttempt = 0;
    logger.info('MongoDB connected', { className: filename });
});

mongoose.connection.on('close', () => {
    logger.info('MongoDB connection closed', { className: filename });
});

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err.message}`, { className: filename });
});

mongoose.connection.on('disconnected', () => {
    connectWithRetry();
});

connectWithRetry();

module.exports = mongoose;
