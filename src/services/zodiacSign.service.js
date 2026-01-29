const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const ZodiacSignRepository = require('../repository/zodiacSign.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getZodiacSigns = async () => {
    let zodiacSigns = cache.get(consCache.CACHE_KEY_ZODIAC_SIGNS);
    if (!zodiacSigns || zodiacSigns.length === 0) {
        zodiacSigns = await ZodiacSignRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_ZODIAC_SIGNS, zodiacSigns, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = zodiacSigns);
};

module.exports = { getZodiacSigns };