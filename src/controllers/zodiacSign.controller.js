const c = require('../../shared/util/constants');
const ZodiacSignService = require('../services/zodiacSign.service');

const getZodiacSigns = async (req, res, next) => {
  try {
    let jsonResponse = await ZodiacSignService.getZodiacSigns();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getZodiacSigns };