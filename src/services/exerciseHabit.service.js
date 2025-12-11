const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const ExerciseHabitRepository = require('../repository/exerciseHabit.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getExerciseHabits = async () => {
    let exerciseHabits = cache.get(consCache.CACHE_KEY_EXERCISE_HABITS);
    if (!exerciseHabits) {
        exerciseHabits = await ExerciseHabitRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_EXERCISE_HABITS, exerciseHabits, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = exerciseHabits);
};

module.exports = { getExerciseHabits };
