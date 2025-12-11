const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Chat = require('../models/chat.model');

const findByPipeline = async (pipeline, populateChildCollections = false) => {
    try {
        const results = await Chat.aggregate(pipeline);

        if (populateChildCollections) {
            const inclusionChild = 'userInfo.fullName photos';
            return await Chat.populate(results, [
                { path: 'users', model: 'User', select: inclusionChild }
            ]);
        }

        return results;
    } catch (err) {
        logger.error(`Error in findByPipeline. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findByAnyFilter = async (filter) => {
    try {
        return await Chat.find(filter);
    } catch (err) {
        logger.error(`Error in findByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findOneByFilter = async (filter) => {
    try {
        return await Chat.findOne(filter);
    } catch (err) {
        logger.error(`Error in findOneByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(chat) {
    try {
        return await chat.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findByAnyFilter, save, findByPipeline, findOneByFilter };