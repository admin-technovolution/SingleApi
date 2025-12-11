const c = require('../../shared/util/constants');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const LikesService = require('../services/likes.service');

const sendLike = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await LikesService.sendLike(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

const likesReceived = async (req, res, next) => {
  try {
    let jsonResponse = await LikesService.likesReceived(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { sendLike, likesReceived };
