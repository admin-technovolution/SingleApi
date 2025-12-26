const path = require('path');
const logger = require('../config/logger');
const filename = path.basename(__filename);
const BusinessException = require('../exceptionHandler/BusinessException');
const c = require('../../shared/util/constants.frontcodes');
const constants = require('../util/constants');
const vision = require('@google-cloud/vision');

const visionServiceAccountBase64 = process.env.VISION_SERVICE_ACCOUNT;
const visionServiceAccountBase64Decoded = Buffer.from(visionServiceAccountBase64, "base64").toString("utf8");
const visionServiceAccount = JSON.parse(visionServiceAccountBase64Decoded);
const visionClient = new vision.ImageAnnotatorClient({
    credentials: visionServiceAccount
});

async function checkNudityImages(files, userId, req, throwException = true) {
    if (!files || !files.length) return [];

    const responseGCV = await callGoogleCallVision(files);

    if (throwException)
        await decideUnsafeImages(responseGCV, userId, req);
}

async function callGoogleCallVision(files) {
    try {
        const results = await Promise.all(
            files.map(async (file) => {
                const [result] = await visionClient.safeSearchDetection(file.buffer);

                const detections = result.safeSearchAnnotation || {};
                const moderation = moderateImage(detections);

                return {
                    filename: file.originalname,
                    buffer: file.buffer,
                    scores: detections,
                    isUnsafe: moderation.isBlocked,
                    isRacy: moderation.isRacy
                };
            })
        );

        return results;
    } catch (error) {
        logger.error(`Error in GCV check. Error: ${error}`, { className: filename });
        throw new BusinessException(c.CODE_INTERNAL_SERVER_ERROR, constants.HTTP_SUCCESS);
    }
}

async function decideUnsafeImages(resultsImages, userId, req) {
    for (const result of resultsImages) {
        if (result.isUnsafe) {
            const log = jsonStringify(result);
            logger.error(`User trying to upload innapropiate content: userId: ${userId}, content: ${log}`, { className: filename, req: req });
            throw new BusinessException(c.CODE_IMAGE_EXPLICIT_CONTENT, constants.HTTP_SUCCESS);
        }
    }
}

function moderateImage(detections = {}) {
    const adult = getSeverityLevel(detections.adult);
    const violence = getSeverityLevel(detections.violence);
    const racy = getSeverityLevel(detections.racy);

    return {
        isBlocked: adult >= 5 || violence >= 3,
        isRacy: racy >= 4,
        scores: {
            adult,
            violence,
            racy
        }
    };
}

function getSeverityLevel(rating) {
    const levels = {
        'VERY_UNLIKELY': 1,
        'UNLIKELY': 2,
        'POSSIBLE': 3,
        'LIKELY': 4,
        'VERY_LIKELY': 5
    };
    return levels[rating] ?? 0;
}

function jsonStringify(obj, options = {}) {
    const {
        omitKeys = ['buffer']
    } = options;

    const omit = new Set(omitKeys);

    return JSON.stringify(
        obj,
        (key, value) => (omit.has(key) ? undefined : value)
    );
}

module.exports = {
    checkNudityImages
};