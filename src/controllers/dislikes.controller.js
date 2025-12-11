const c = require('../../shared/util/constants');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const DislikesService = require('../services/dislikes.service');

const sendDislike = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await DislikesService.sendDislike(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { sendDislike };
