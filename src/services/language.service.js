const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const LanguageRepository = require('../repository/language.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getLanguages = async () => {
    let languages = cache.get(consCache.CACHE_KEY_LANGUAGES);
    if (!languages || languages.length === 0) {
        languages = await LanguageRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_LANGUAGES, languages, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = languages);
};

module.exports = { getLanguages };
