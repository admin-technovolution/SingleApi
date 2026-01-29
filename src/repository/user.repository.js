const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const User = require('../models/user.model');

const findByPipeline = async (pipeline, populateChildCollections = false) => {
    try {
        const results = await User.aggregate(pipeline);

        if (populateChildCollections) {
            const exclussionChild = '-status';
            return await User.populate(results, [
                { path: 'userInfo.gender', model: 'Gender', select: exclussionChild },
                { path: 'userInfo.sexualOrientation', model: 'SexualOrientation', select: exclussionChild },
                { path: 'userInfo.languages', model: 'Language', select: exclussionChild },
                { path: 'userInfo.familyPlans', model: 'FamilyPlan', select: exclussionChild },
                { path: 'userInfo.zodiacSign', model: 'ZodiacSign', select: exclussionChild },
                { path: 'preferences.preferences', model: 'Gender', select: exclussionChild },
                { path: 'preferences.lookingFor', model: 'LookingFor', select: exclussionChild },
                { path: 'lifestyle.drinking', model: 'DrinkingHabit', select: exclussionChild },
                { path: 'lifestyle.smoking', model: 'SmokingHabit', select: exclussionChild },
                { path: 'lifestyle.exercise', model: 'ExerciseHabit', select: exclussionChild },
                { path: 'lifestyle.diet', model: 'DietHabit', select: exclussionChild },
                { path: 'musicPreferences.topArtist', model: 'Artist', select: exclussionChild },
                { path: 'musicPreferences.musicGenres', model: 'MusicGenre', select: exclussionChild },
                { path: 'profileConfig.preferredLanguage', model: 'Language', select: exclussionChild }
            ]);
        }

        return results;
    } catch (err) {
        logger.error(`Error in findByPipeline. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findById = async (id, exclussions = '', populateChildCollections = false) => {
    try {
        let query = User.findById(id).select(exclussions);

        if (populateChildCollections) {
            const exclussionChild = '-status';
            query = query
                .populate({ path: 'userInfo.gender', model: 'Gender', select: exclussionChild })
                .populate({ path: 'userInfo.sexualOrientation', model: 'SexualOrientation', select: exclussionChild })
                .populate({ path: 'userInfo.languages', model: 'Language', select: exclussionChild })
                .populate({ path: 'userInfo.familyPlans', model: 'FamilyPlan', select: exclussionChild })
                .populate({ path: 'userInfo.zodiacSign', model: 'ZodiacSign', select: exclussionChild })
                .populate({ path: 'preferences.preferences', model: 'Gender', select: exclussionChild })
                .populate({ path: 'preferences.lookingFor', model: 'LookingFor', select: exclussionChild })
                .populate({ path: 'lifestyle.drinking', model: 'DrinkingHabit', select: exclussionChild })
                .populate({ path: 'lifestyle.smoking', model: 'SmokingHabit', select: exclussionChild })
                .populate({ path: 'lifestyle.exercise', model: 'ExerciseHabit', select: exclussionChild })
                .populate({ path: 'lifestyle.diet', model: 'DietHabit', select: exclussionChild })
                .populate({ path: 'musicPreferences.topArtist', model: 'Artist', select: exclussionChild })
                .populate({ path: 'musicPreferences.musicGenres', model: 'MusicGenre', select: exclussionChild })
                .populate({ path: 'profileConfig.preferredLanguage', model: 'Language', select: exclussionChild });
        }

        return await query.lean();
    } catch (err) {
        logger.error(`Error in findById. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

const findOneByFilter = async (filter) => {
    try {
        return await User.findOne(filter)
            .collation({ locale: 'en', strength: 2 });
    } catch (err) {
        logger.error(`Error in findOneByFilter. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function save(user) {
    try {
        return await user.save();
    } catch (err) {
        logger.error(`Error in save. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function findByIdAndDelete(id) {
    try {
        return await User.findByIdAndDelete(id);
    } catch (err) {
        logger.error(`Error in findByIdAndDelete. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function findByIdAndUpdate(id, user) {
    try {
        return await User.findByIdAndUpdate(
            { _id: id },
            { $set: user },
            { new: true }
        );
    } catch (err) {
        logger.error(`Error in findByIdAndUpdate. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findById, findOneByFilter, save, findByIdAndUpdate, findByPipeline, findByIdAndDelete };