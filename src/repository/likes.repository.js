const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const Likes = require('../models/likes.model');

const countLikesByFilter = async (filter) => {
    try {
        return await Likes.countDocuments(filter);
    } catch (err) {
        logger.error(`Error in countLikesByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findByAnyFilter = async (filter) => {
    try {
        return await Likes.find(filter);
    } catch (err) {
        logger.error(`Error in findByAnyFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findByPipeline = async (pipeline) => {
    try {
        return await Likes.aggregate(pipeline);
    } catch (err) {
        logger.error(`Error in findByPipeline. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(like) {
    try {
        return await like.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function deleteByFilter(filter) {
    try {
        return await Likes.deleteOne(filter);
    } catch (err) {
        logger.error(`Error in deleteByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const deleteById = async (id) => {
    try {
        return await Likes.findByIdAndDelete(id);
    } catch (err) {
        logger.error(`Error in deleteById. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}
module.exports = { findByAnyFilter, findByPipeline, save, deleteByFilter, deleteById, countLikesByFilter };