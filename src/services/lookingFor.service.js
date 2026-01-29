const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const constants = require('../../shared/util/constants');
const LookingForRepository = require('../repository/lookingFor.repository');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getLookingFor = async () => {
    let lookingFor = cache.get(consCache.CACHE_KEY_LOOKING_FOR);
    if (!lookingFor || lookingFor.length === 0) {
        lookingFor = await LookingForRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_LOOKING_FOR, lookingFor, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = lookingFor);
};

module.exports = { getLookingFor };
