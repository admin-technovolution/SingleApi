const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Conversation = require('../models/conversation.model');

const findByPipeline = async (pipeline) => {
    try {
        return await Conversation.aggregate(pipeline);
    } catch (err) {
        logger.error(`Error in findByPipeline. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findOneByFilter = async (filter) => {
    try {
        return await Conversation.findOne(filter);
    } catch (err) {
        logger.error(`Error in findOneByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(conversation) {
    try {
        return await conversation.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function updateMany(filter, update, options = {}) {
    try {
        return await Conversation.updateMany(filter, update, options);
    } catch (err) {
        logger.error(`Error in updateMany. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { save, updateMany, findByPipeline, findOneByFilter };