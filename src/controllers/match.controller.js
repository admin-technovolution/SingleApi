const c = require('../../shared/util/constants');
const MatchService = require('../services/match.service');

const getMatches = async (req, res, next) => {
  try {
    let jsonResponse = await MatchService.getMatches(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const unmatched = async (req, res, next) => {
  try {
    let jsonResponse = await MatchService.unmatched(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const blocked = async (req, res, next) => {
  try {
    let jsonResponse = await MatchService.blocked(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMatches, unmatched, blocked };