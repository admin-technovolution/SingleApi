const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Match = require('../models/match.model');

const findByPipeline = async (pipeline) => {
    try {
        return await Match.aggregate(pipeline);
    } catch (err) {
        logger.error(`Error in findByPipeline. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findOneByFilter = async (filter) => {
    try {
        return await Match.findOne(filter);
    } catch (err) {
        logger.error(`Error in findOneByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findByAnyFilter = async (filter) => {
    try {
        return await Match.find(filter);
    } catch (err) {
        logger.error(`Error in findByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function updateOne(filter, update, options = {}) {
    try {
        return await Match.updateOne(filter, update, options);
    } catch (err) {
        logger.error(`Error in updateOne. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(match) {
    try {
        return await match.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findByAnyFilter, findOneByFilter, save, findByPipeline, updateOne };