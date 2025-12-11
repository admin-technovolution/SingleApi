const { v4: uuidv4 } = require('uuid');
const requestContext = require('../config/requestContext');

function correlationMiddleware(req, res, next) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    const store = { correlationId };
    req.correlationId = correlationId;
    requestContext.run(store, () => {
        res.setHeader('x-correlation-id', correlationId);
        next();
    });
}

module.exports = correlationMiddleware;
