const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const GenderRepository = require('../repository/gender.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getGenders = async () => {
    let genders = cache.get(consCache.CACHE_KEY_GENRE);
    if (!genders) {
        genders = await GenderRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_GENRE, genders, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = genders);
};

module.exports = { getGenders };
