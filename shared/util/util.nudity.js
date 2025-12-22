const path = require('path');
const logger = require('../config/logger');
const filename = path.basename(__filename);
const util = require('util');
const DataLayerException = require('../exceptionHandler/DataLayerException');
const c = require('../../shared/util/constants.frontcodes');
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");
const vision = require('@google-cloud/vision');

const visionServiceAccountBase64 = process.env.VISION_SERVICE_ACCOUNT;
const visionServiceAccountBase64Decoded = Buffer.from(visionServiceAccountBase64, "base64").toString("utf8");
const visionServiceAccount = JSON.parse(visionServiceAccountBase64Decoded);

const visionClient = new vision.ImageAnnotatorClient({
    credentials: visionServiceAccount
});

let modelnsfw = null;

if (!util.isNullOrUndefined) {
    util.isNullOrUndefined = (v) => v === null || v === undefined;
}

async function loadModel() {
    if (!modelnsfw) {
        modelnsfw = await nsfw.load('MobileNetV2Mid');
    }
    return modelnsfw;
}

async function checkNudityImages(files, userId, req, throwException = true) {
    if (!files || !files.length) return [];

    const resultsNSFW = await validateWithNSFW(files);
    if (throwException)
        await decideUnsafeImages(resultsNSFW, userId, req);

    const imagesGoogleCloudVision = await getImagesToSendGoogleCloudVision(resultsNSFW);
    if (imagesGoogleCloudVision && imagesGoogleCloudVision.length > 0) {
        logger.info(`Calling Google Cloud Vision with ${imagesGoogleCloudVision.length} images`, { className: filename, req: req });
        const responseGCV = await callGoogleCallVision(imagesGoogleCloudVision);

        if (throwException)
            await decideUnsafeImages(responseGCV, userId, req);
    }
}

async function callGoogleCallVision(files) {
    try {
        const results = await Promise.all(
            files.map(async (file) => {
                const [result] = await visionClient.safeSearchDetection(file.buffer);

                const detections = result.safeSearchAnnotation || {};
                const moderation = moderateImage(detections);
                console.log(moderation)

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
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function decideUnsafeImages(resultsImages, userId, req) {
    for (const result of resultsImages) {
        if (result.isUnsafe) {
            const log = jsonStringify(result);
            logger.error(`User trying to upload innapropiate content: userId: ${userId}, content: ${log}`, { className: filename, req: req });
            throw new DataLayerException(c.CODE_IMAGE_EXPLICIT_CONTENT);
        }
    }
}

async function validateWithNSFW(files) {
    try {
        const results = await Promise.all(
            files.map(async (file) => {
                const predictions = await checkNudity(file.buffer);
                const analysis = analyzePredictions(predictions);

                return {
                    filename: file.originalname,
                    buffer: file.buffer,
                    predictions,
                    scores: analysis.scores,
                    isUnsafe: analysis.isUnsafe,
                    shouldCallGoogleVision: analysis.shouldCallGoogleVision
                };
            })
        );

        return results;
    } catch (error) {
        logger.error(`Error in NSFW check. Error: ${error}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

async function checkNudity(buffer) {
    const modelnsfw = await loadModel();
    const image = tf.node.decodeImage(buffer, 3);

    const predictions = await modelnsfw.classify(image);
    image.dispose();

    return predictions;
}

async function getImagesToSendGoogleCloudVision(resultsNSFW) {
    return resultsNSFW.filter(result => result.shouldCallGoogleVision);
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

function analyzePredictions(predictions) {
    const scores = {};
    predictions.forEach(p => {
        scores[p.className] = p.probability;
    });

    const porn = scores.Porn ?? 0;
    const hentai = scores.Hentai ?? 0;
    const sexy = scores.Sexy ?? 0;

    const isUnsafe = porn >= 0.95 || hentai >= 0.8;
    const shouldCallGoogleVision = !isUnsafe;

    return {
        scores: {
            porn,
            hentai,
            sexy
        },
        isUnsafe,
        shouldCallGoogleVision
    };
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

loadModel();

module.exports = {
    checkNudityImages
};