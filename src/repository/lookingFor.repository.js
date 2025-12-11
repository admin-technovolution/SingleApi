const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const LookingFor = require('../models/lookingFor.model');

const findAllByStatus = async (status) => {
    try {
        return await LookingFor.find({ status: status }).lean();
    } catch (err) {
        logger.error(`Error in findAllByStatus. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findAllByStatus };