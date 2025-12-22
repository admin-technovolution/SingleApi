const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const packageJson = require("../../package.json");
const redisClient = require('../../shared/config/redis');
const { transporter } = require("../../shared/email/mailer");
const BaseResponse = require('../../shared/util/baseResponse');
const { base } = require('../models/likes.model');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Healthcheck
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.get("/health", async (req, res) => {
    const healthInfo = {
        status: "ok",
        name: packageJson.name,
        version: packageJson.version,
        environment: process.env.NODE_ENV || "local",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {}
    };

    await mongoStatus(healthInfo);
    await redisStatus(healthInfo);
    await mailerStatus(healthInfo);

    const httpStatus = healthInfo.status === "ok" ? 200 : 503;
    const baseResponse = new BaseResponse(healthInfo.status === "ok", [], healthInfo);

    return res.status(httpStatus).json(baseResponse);
});

const mongoStatus = async (healthInfo) => {
    try {
        const states = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting"
        };

        const mongoState = mongoose.connection.readyState;

        healthInfo.services.mongo = {
            status: states[mongoState],
            uri: process.env.MONGO_URI ? "configured" : "missing"
        };

        if (mongoState !== 1) {
            healthInfo.status = "degraded";
        }
    } catch (err) {
        healthInfo.services.mongo = {
            status: "error",
            error: err.message
        };
        healthInfo.status = "error";
    }
}

const redisStatus = async (healthInfo) => {
    try {
        const pong = await redisClient.ping();

        healthInfo.services.redis = {
            status: pong === "PONG" ? "connected" : "error",
            uri: process.env.REDIS_URI ? "configured" : "missing"
        };

        if (pong !== "PONG") {
            healthInfo.status = "degraded";
        }
    } catch (err) {
        healthInfo.services.redis = {
            status: "error",
            error: err.message
        };
        healthInfo.status = "error";
    }
}

const mailerStatus = async (healthInfo) => {
    try {
        await transporter.verify();

        healthInfo.services.mailer = {
            status: "connected",
            service: transporter.options.service || null,
            user: transporter.options.auth.user
        };
    } catch (err) {
        healthInfo.services.mailer = {
            status: "error",
            error: err.message
        };
        healthInfo.status = "degraded";
    }
}


module.exports = router;