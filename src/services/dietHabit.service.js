const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const DietHabitRepository = require('../repository/dietHabit.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getDietHabits = async () => {
    let dietHabits = cache.get(consCache.CACHE_KEY_DIET_HABITS);
    if (!dietHabits || dietHabits.length === 0) {
        dietHabits = await DietHabitRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_DIET_HABITS, dietHabits, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = dietHabits);
};

module.exports = { getDietHabits };
