const path = require('path');
const logger = require('../config/logger');
const filename = path.basename(__filename);
const BusinessException = require('../exceptionHandler/BusinessException');
const { OAuth2Client } = require('google-auth-library');
const c = require('../util/constants.frontcodes');
const constants = require('../util/constants');
const googleServiceAudience = process.env.GOOGLE_SERVICE_AUDIENCE;

module.exports = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader)
        throw new BusinessException(c.CODE_ERROR_AUTH, constants.HTTP_UNATHORIZED);

    const token = bearerHeader.split(' ')[1];
    if (token === '')
        throw new BusinessException(c.CODE_ERROR_AUTH, constants.HTTP_UNATHORIZED);

    try {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleServiceAudience,
        });
        logger.info({ message: `Verified Google Pub/Sub push JWT`, className: filename, req: req });
        next();
    } catch (err) {
        logger.error(`Error validating Google Pub/Sub push JWT: ${err}`, { className: filename });
        throw new BusinessException(c.CODE_ERROR_AUTH, constants.HTTP_UNATHORIZED);
    }
};
