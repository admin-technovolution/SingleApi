const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const ConfigRepository = require('../repository/config.repository');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getConfigs = async () => {
    let config = cache.get(consCache.CACHE_KEY_CONFIGS);

    if (!config) {
        config = await ConfigRepository.findAll();
        cache.set(consCache.CACHE_KEY_CONFIGS, config, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = config);
};

module.exports = { getConfigs };
