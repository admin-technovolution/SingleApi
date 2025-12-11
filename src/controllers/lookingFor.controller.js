const c = require('../../shared/util/constants');
const LookingForService = require('../services/lookingFor.service');

const getLookingFor = async (req, res, next) => {
  try {
    let jsonResponse = await LookingForService.getLookingFor();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLookingFor };
