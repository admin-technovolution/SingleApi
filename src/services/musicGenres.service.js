const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const MusicGenresRepository = require('../repository/musicGenres.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getMusicGenres = async () => {
    let musicGenres = cache.get(consCache.CACHE_KEY_MUSIC_GENRES);
    if (!musicGenres) {
        musicGenres = await MusicGenresRepository.findAllByStatus(constants.STATUS_ACTIVE);
        cache.set(consCache.CACHE_KEY_MUSIC_GENRES, musicGenres, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = musicGenres);
};

module.exports = { getMusicGenres };