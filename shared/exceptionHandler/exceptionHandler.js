const path = require('path');
const logger = require('../config/logger');
const filename = path.basename(__filename);
const multer = require('multer');
const c = require('../../shared/util/constants.frontcodes');
const BaseResponse = require('../util/baseResponse');
const ClientException = require('./ClientException');
const BusinessException = require('./BusinessException');
const DataLayerException = require('./DataLayerException');

function exceptionHandler(err, req, res, next) {
    logger.error({ message: `Ingresando a exceptionHandler. Error: ${err}`, className: filename, req: req });
    let message = err.message;
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        let response = new BaseResponse(false, [c.CODE_MALFORMED_BAD_REQUEST]);
        return res.status(err.status).json(response);
    }

    if (err instanceof BusinessException) {
        let response = new BaseResponse(false, [message]);
        return res.status(err.statusCode).json(response);
    }

    if (err instanceof ClientException) {
        let response = new BaseResponse(false, [message]);
        return res.status(err.statusCode).json(response);
    }

    if (err instanceof DataLayerException) {
        let response = new BaseResponse(false, [message]);
        return res.status(err.statusCode).json(response);
    }

    if (err instanceof multer.MulterError) {
        let response = new BaseResponse(false, [err.code]);
        return res.status(err.statusCode || 400).json(response);
    }
    let statusCode = err.statusCode || 500;
    message = c.CODE_INTERNAL_SERVER_ERROR;

    let response = new BaseResponse(false, [message]);
    res.status(statusCode).json(response);
}

module.exports = exceptionHandler;
