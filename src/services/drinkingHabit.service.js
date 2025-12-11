const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const DrinkingHabitRepository = require('../repository/drinkingHabit.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getDrinkingHabits = async () => {
    let drinkingHabits = cache.get(consCache.CACHE_KEY_DRINKING_HABITS);
    if (!drinkingHabits) {
        drinkingHabits = await DrinkingHabitRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_DRINKING_HABITS, drinkingHabits, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = drinkingHabits);
};

module.exports = { getDrinkingHabits };
