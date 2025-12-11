const c = require('../../shared/util/constants');
const MusicGenresService = require('../services/musicGenres.service');

const getMusicGenres = async (req, res, next) => {
  try {
    let jsonResponse = await MusicGenresService.getMusicGenres();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMusicGenres };