const redis = require('../../../../shared/config/redis');
const consCache = require('../../../../shared/util/constants.cache');

module.exports = (socket, namespace) => {
    socket.on('disconnect', async () => {
        if (socket.userId) {
            await redis.sRem(`${consCache.REDIS_KEY_USER_SOCKETS}${socket.userId}`, socket.id);
        }
    });
};
