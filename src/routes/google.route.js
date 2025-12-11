const express = require('express');
const router = express.Router();
const validateTokenGoogle = require('../../shared/middlewares/validateTokenGoogle');
const GoogleController = require('../controllers/google.controller');

/**
 * @swagger
 * /api/rtdn/google/subscription-notification:
 *   post:
 *     summary: Receive Google RTDN subscription notification
 *     tags:
 *       - RTDN Google
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       401:
 *         description: Unauthorized
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
router.post('/google/subscription-notification', validateTokenGoogle, GoogleController.subscriptionNotification);

module.exports = router;