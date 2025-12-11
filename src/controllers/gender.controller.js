const c = require('../../shared/util/constants');
const GenderService = require('../services/gender.service');

const getGenders = async (req, res, next) => {
  try {
    let jsonResponse = await GenderService.getGenders();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getGenders };
