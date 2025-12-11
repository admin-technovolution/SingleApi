const c = require('../../shared/util/constants');
const LanguageService = require('../services/language.service');

const getLanguages = async (req, res, next) => {
  try {
    let jsonResponse = await LanguageService.getLanguages();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLanguages };
