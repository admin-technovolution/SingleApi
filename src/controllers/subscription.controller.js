const c = require('../../shared/util/constants');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const SubscriptionService = require('../services/subscription.service');

const createSubscription = async (req, res, next) => {
  try {
    if (!req.body) throw new BusinessException(c.ERROR_BAD_REQUEST_RESPONSE);

    let jsonResponse = await SubscriptionService.createSubscription(req);
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { createSubscription };
