const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const SexualRepository = require('../repository/sexualOrientation.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getSexualOrientations = async () => {
    let sexualOrientations = cache.get(consCache.CACHE_KEY_SEXUAL_ORIENTATIONS);
    if (!sexualOrientations || sexualOrientations.length === 0) {
        sexualOrientations = await SexualRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_SEXUAL_ORIENTATIONS, sexualOrientations, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = sexualOrientations);
};

module.exports = { getSexualOrientations };
