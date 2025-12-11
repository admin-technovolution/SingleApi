const express = require('express');
const router = express.Router();
const LanguageController = require('../controllers/language.controller');

/**
 * @swagger
 * /api/master/language:
 *   get:
 *     summary: Get languages
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
router.get('/language', LanguageController.getLanguages);

module.exports = router;