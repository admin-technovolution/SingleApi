const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const SmokingHabitRepository = require('../repository/smokingHabit.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getSmokingHabits = async () => {
    let smokingHabits = cache.get(consCache.CACHE_KEY_SMOKING_HABITS);
    if (!smokingHabits || smokingHabits.length === 0) {
        smokingHabits = await SmokingHabitRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_SMOKING_HABITS, smokingHabits, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = smokingHabits);
};

module.exports = { getSmokingHabits };
