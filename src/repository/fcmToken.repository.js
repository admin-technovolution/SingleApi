const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const FCMToken = require('../models/fcmToken.model');

const findOneByFilter = async (filter) => {
    try {
        return await FCMToken.findOne(filter);
    } catch (err) {
        logger.error(`Error in findOneByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function findOneByFilterAndPullToken(filter, pull) {
    try {
        return await FCMToken.updateOne(
            filter,
            { $pull: pull }
        );
    } catch (err) {
        logger.error(`Error in findOneByFilterAndPullToken. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function deleteAllByFilter(filter) {
    try {
        return await FCMToken.deleteMany(filter);
    } catch (err) {
        logger.error(`Error in deleteAllByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(fcmToken) {
    try {
        return await fcmToken.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findOneByFilter, findOneByFilterAndPullToken, save, deleteAllByFilter };