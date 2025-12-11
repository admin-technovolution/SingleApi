const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const BaseResponse = require('../../shared/util/baseResponse');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const JWT_ACCESS_TOKEN_TTL_SECS = process.env.JWT_ACCESS_TOKEN_TTL_SECS;
const JWT_REFRESH_TOKEN_TTL_SECS = process.env.JWT_REFRESH_TOKEN_TTL_SECS;
const RESETCODE_REDIS_TTL_SECS = process.env.RESETCODE_REDIS_TTL_SECS;
const MAX_ATTEMPTS_VERIFYING_RESETCODE = process.env.MAX_ATTEMPTS_VERIFYING_RESETCODE;
const mailer = require('../../shared/email/mailer');
const EnumTemplatesHtml = require('../../shared/email/htmlConstants/EnumTemplatesHtml');
const EnumSubjectEmail = require('../../shared/email/htmlConstants/EnumSubjectEmail');
const c = require('../../shared/util/constants.frontcodes');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');
const util = require('../../shared/util/util');
const jwt = require('../../shared/util/jwt');
const redisClient = require('../../shared/config/redis');
const bcrypt = require('bcryptjs');
const FCMToken = require('../models/fcmToken.model');
const FCMTokenRepository = require('../repository/fcmToken.repository');
const UserRepository = require('../repository/user.repository');

const logoutUser = async (req) => {
    try {
        let { accessToken, refreshToken, fcmToken } = req.body;

        FCMTokenRepository.findOneByFilterAndPullToken(
            { fcmTokens: fcmToken },
            { fcmTokens: fcmToken }
        );

        redisClient.del(`${consCache.REDIS_KEY_REFRESH_TOKEN}${refreshToken}`);
        redisClient.del(`${consCache.REDIS_KEY_ACCESS_TOKEN}${accessToken}`);
    } catch (err) {
        logger.error(`Error logout: ${err}`, { className: filename });
    }
    message = c.CODE_SUCCESS_LOGOUT;
    return new BaseResponse(true, [message]);
}

const refreshTokenUser = async (req) => {
    try {
        let { refreshToken } = req.body;

        const tokenConcat = consCache.REDIS_KEY_REFRESH_TOKEN + refreshToken;
        const exists = await redisClient.exists(tokenConcat);
        if (exists !== 1) {
            throw new BusinessException(c.CODE_ERROR_AUTH, 401);
        }

        const user = {
            _id: jwt.getValueFromJwtToken(refreshToken, 'id', false),
            email: jwt.getValueFromJwtToken(refreshToken, 'email', false)
        };

        const payload = {
            id: user._id,
            email: user.email
        };

        const payloadRefresh = {
            id: user._id,
            email: user.email,
            hash: util.generateRandomHash(),
        };

        await redisClient.del(tokenConcat);
        const token = await generateTokenAndSaveToken(payload, JWT_ACCESS_TOKEN_TTL_SECS, consCache.REDIS_KEY_ACCESS_TOKEN);
        refreshToken = await generateTokenAndSaveToken(payloadRefresh, JWT_REFRESH_TOKEN_TTL_SECS, consCache.REDIS_KEY_REFRESH_TOKEN);

        return new BaseResponse(true, [], { token, refreshToken });
    } catch (err) {
        logger.error(`Error refreshing token: ${err}`, { className: filename });
        throw new BusinessException(c.CODE_ERROR_AUTH, 401);
    }
}

const loginUser = async (req) => {
    let { email, password, fcmToken } = req.body;
    const user = await UserRepository.findOneByFilter({ email: email });

    if (!user || user.status !== constants.STATUS_DESC_ACTIVE) throw new BusinessException(c.CODE_ERROR_LOGIN, 401);
    let isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new BusinessException(c.CODE_ERROR_LOGIN, 401);

    const payload = {
        id: user._id,
        email: user.email
    };

    const payloadRefresh = {
        id: user._id,
        email: user.email,
        hash: util.generateRandomHash(),
    };

    const result = await FCMTokenRepository.findOneByFilter({ userId: user._id });
    if (result) {
        const existsFcmToken = result.fcmTokens.some(i => i === fcmToken);

        if (!existsFcmToken) {
            result.fcmTokens.push(fcmToken);
            await FCMTokenRepository.save(result);
        }
    } else {
        const fcmTokenDoc = new FCMToken({
            userId: user._id,
            fcmTokens: [fcmToken],
        });
        await FCMTokenRepository.save(fcmTokenDoc);
    }


    const token = await generateTokenAndSaveToken(payload, JWT_ACCESS_TOKEN_TTL_SECS, consCache.REDIS_KEY_ACCESS_TOKEN);
    const refreshToken = await generateTokenAndSaveToken(payloadRefresh, JWT_REFRESH_TOKEN_TTL_SECS, consCache.REDIS_KEY_REFRESH_TOKEN);

    return new BaseResponse(true, [], { token, refreshToken });
};

const sendPasswordResetCode = async (req) => {
    const { email } = req.body;
    const user = await UserRepository.findOneByFilter({ email: email });

    if (user) {
        const verificationCode = util.generateVerificationCode();
        const verificationCodeHashed = await util.generateHash(verificationCode, false);
        const redisKey = `${consCache.REDIS_KEY_PASSWORD_RESET_CODE}${user._id}`;
        const value = JSON.stringify({ code: verificationCodeHashed, attempts: 0 });

        await redisClient.del(redisKey);
        await redisClient.setEx(redisKey, RESETCODE_REDIS_TTL_SECS, value);

        const verificationExpireMins = Math.floor(RESETCODE_REDIS_TTL_SECS / 60);

        sendVerificationEmail(email, verificationCode, verificationExpireMins);
    }

    message = c.CODE_SUCCESS_SENT_PASSWORD_RESET_CODE;
    return new BaseResponse(true, [message]);
}

const verifyResetCode = async (req) => {
    const { email, verificationCode, password } = req.body;
    const user = await UserRepository.findOneByFilter({ email: email });

    if (!user) throw new BusinessException(c.CODE_ERROR_AUTH, 401);

    const verificationCodeHashed = await util.generateHash(verificationCode, false);
    const redisKey = `${consCache.REDIS_KEY_PASSWORD_RESET_CODE}${user._id}`;
    let userResetCode = await redisClient.get(redisKey);

    if (!userResetCode) throw new BusinessException(c.CODE_ERROR_AUTH, 401);

    userResetCode = JSON.parse(userResetCode);

    if (userResetCode.code !== verificationCodeHashed) {
        userResetCode.attempts += 1;
        if (userResetCode.attempts >= MAX_ATTEMPTS_VERIFYING_RESETCODE) {
            await redisClient.del(redisKey);
        } else {
            const value = JSON.stringify(userResetCode);
            await redisClient.set(redisKey, value, { KEEPTTL: true });
        }
        throw new BusinessException(c.CODE_ERROR_AUTH, 401);
    }

    let hashedPassword = await util.generateHash(password, true);
    await UserRepository.findByIdAndUpdate(user._id, { password: hashedPassword });
    await redisClient.del(redisKey);
    deleteRedisTokens(user._id.toString());
    deleteFcmTokens(user._id.toString());

    message = c.CODE_SUCCESS_RESET_PASSWORD;
    return new BaseResponse(true, [message]);
}

const sendVerificationEmail = async (email, code, verificationExpireMins) => {
    let subject = EnumSubjectEmail.SUBJECT_RECOVERY_PASSWORD;
    let html = EnumTemplatesHtml.TEMPLATE_HTML_RECOVERY_PASSWORD;
    html = html
        .replace(/\[code\]/g, code)
        .replace(/\[verificationExpireMins\]/g, verificationExpireMins);
    await mailer.sendEmail(email, subject, html);
};

const generateTokenAndSaveToken = async (payload, ttl, redisKey) => {
    const token = jwt.generateToken(payload, ttl);

    await redisClient.setEx(`${redisKey}${token}`, ttl, JSON.stringify(payload));
    return token;
};

const deleteRedisTokens = async (userId) => {
    const dataAccessTokens = await getRedisDataByPattern(`${consCache.REDIS_KEY_ACCESS_TOKEN}*`);
    const dataRefreshTokens = await getRedisDataByPattern(`${consCache.REDIS_KEY_REFRESH_TOKEN}*`);

    await deleteKeysByUserId(dataAccessTokens, userId);
    await deleteKeysByUserId(dataRefreshTokens, userId);
}

const deleteFcmTokens = async (userId) => {
    await FCMTokenRepository.deleteAllByFilter({ userId: userId });
}

const deleteKeysByUserId = async (data, userId) => {
    for (const item of data) {
        const value = JSON.parse(item.value);
        if (value.id === userId) {
            await redisClient.del(item.key);
        }
    }
}

const getRedisDataByPattern = async (pattern) => {
    const keys = [];

    for await (const key of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
    })) {
        key.forEach(k => keys.push(k.toString()));
    }

    if (keys.length === 0) return [];

    const values = await redisClient.mGet(keys);
    return keys.map((k, i) => ({ key: k, value: values[i] }));
}

module.exports = { loginUser, refreshTokenUser, logoutUser, sendPasswordResetCode, verifyResetCode };
