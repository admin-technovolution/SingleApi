const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Dislikes = require('../models/dislikes.model');

const findByAnyFilter = async (filter) => {
    try {
        return await Dislikes.find(filter);
    } catch (err) {
        logger.error(`Error in findByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(dislike) {
    try {
        return await dislike.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const deleteById = async (id) => {
    try {
        return await Dislikes.find(id);
    } catch (err) {
        logger.error(`Error in deleteById. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const deleteManyByFilter = async (filter) => {
    try {
        return await Dislikes.deleteMany(filter);
    } catch (err) {
        logger.error(`Error in deleteManyByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findByAnyFilter, save, deleteById, deleteManyByFilter };