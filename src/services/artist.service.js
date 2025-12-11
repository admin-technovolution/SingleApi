const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const ArtistRepository = require('../repository/artist.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getArtists = async () => {
    let artists = cache.get(consCache.CACHE_KEY_ARTISTS);
    if (!artists) {
        artists = await ArtistRepository.findAllByStatus(constants.STATUS_ACTIVE, constants.DEFAULT_SORTING_BY_NAME);
        cache.set(consCache.CACHE_KEY_ARTISTS, artists, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = artists);
};

module.exports = { getArtists };