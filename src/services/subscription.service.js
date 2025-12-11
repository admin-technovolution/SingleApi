const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const BaseResponse = require('../../shared/util/baseResponse');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const c = require('../../shared/util/constants.frontcodes');
const jwtUtil = require('../../shared/util/jwt');
const googlePayClient = require('../client/googlePay.client');
const SubscriptionRepository = require('../repository/subscription.repository');
const Subscription = require('../models/subscription.model');

const createSubscription = async (req) => {
    let token = req.headers['authorization'];
    let subscriptionDB;
    const userId = jwtUtil.getValueFromJwtToken(token, 'id');
    let body = req.body;

    const { purchaseToken, subscriptionId, packageName } = body;
    await validateUniquePurchaseToken(purchaseToken);

    const responseSubscription = await googlePayClient.verifySubscription(req, purchaseToken, subscriptionId, packageName);
    if (!responseSubscription) {
        const message = c.CODE_GOOGLE_SUBSCRIPTION_INVALID;
        return new BaseResponse(false, [message]);
    } else {
        const subscription = new Subscription({
            userId: userId,
            subscriptionId: body.subscriptionId,
            packageName: body.packageName,
            purchaseToken: body.purchaseToken,
            offerToken: body.offerToken,
            orderId: responseSubscription.orderId,
            paymentInfo: {
                fromDate: new Date(parseInt(responseSubscription.startTimeMillis)),
                toDate: new Date(parseInt(responseSubscription.expiryTimeMillis)),
                priceAmountMicros: parseInt(responseSubscription.priceAmountMicros),
                priceCurrencyCode: responseSubscription.priceCurrencyCode,
                countryCode: responseSubscription.countryCode,
                paymentState: responseSubscription.paymentState,
                cancelReason: responseSubscription.cancelReason,
                acknowledgementState: responseSubscription.acknowledgementState
            }
        });

        subscriptionDB = await SubscriptionRepository.save(subscription);
        subscriptionDB._id = undefined;
        subscriptionDB.userId = undefined;
        subscriptionDB.purchaseToken = undefined;
    }

    message = c.CODE_SUCCESS;
    return new BaseResponse(true, null, subscriptionDB);
};

const validateUniquePurchaseToken = async (purchaseToken) => {
    const filter = { purchaseToken: purchaseToken };
    const existingSubscription = await SubscriptionRepository.findByFilter(filter);

    if (existingSubscription) {
        const message = c.CODE_GOOGLE_SUBSCRIPTION_EXISTS;
        throw new BusinessException(message);
    }
};

module.exports = { createSubscription };
