const express = require('express');
const router = express.Router();

const ZodiacSignController = require('../controllers/zodiacSign.controller');

/**
 * @swagger
 * /api/master/zodiac-sign:
 *   get:
 *     summary: Get zodiac signs
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
router.get('/zodiac-sign', ZodiacSignController.getZodiacSigns);

module.exports = router;