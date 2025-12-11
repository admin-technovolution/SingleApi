const c = require('../../shared/util/constants');
const DiscoverService = require('../services/discover.service');

const getUsersDiscover = async (req, res, next) => {
  try {
    let jsonResponse = await DiscoverService.getUsersDiscover(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsersDiscover };