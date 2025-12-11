const c = require('../../shared/util/constants');
const SexualOrientationsService = require('../services/sexualOrientation.service');

const getSexualOrientations = async (req, res, next) => {
  try {
    let jsonResponse = await SexualOrientationsService.getSexualOrientations();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSexualOrientations };
