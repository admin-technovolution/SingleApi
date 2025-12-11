const c = require('../../shared/util/constants');
const ArtistService = require('../services/artist.service');

const getArtists = async (req, res, next) => {
  try {
    let jsonResponse = await ArtistService.getArtists();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getArtists };