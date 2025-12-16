const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Report = require('../models/report.model');

const findByAnyFilter = async (filter) => {
    try {
        return await Report.find(filter);
    } catch (err) {
        logger.error(`Error in findByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findOneByAnyFilter = async (filter) => {
    try {
        return await Report.findOne(filter);
    } catch (err) {
        logger.error(`Error in findOneByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(report) {
    try {
        return await report.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findByAnyFilter, findOneByAnyFilter, save };