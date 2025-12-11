const express = require('express');
const router = express.Router();

const SexualOrientationsController = require('../controllers/sexualOrientation.controller');

/**
 * @swagger
 * /api/master/sexual-orientation:
 *   get:
 *     summary: Get sexual orientations
 *     tags:
 *       - Master Data
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
router.get('/sexual-orientation', SexualOrientationsController.getSexualOrientations);

module.exports = router;