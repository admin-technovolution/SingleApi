const express = require('express');
const router = express.Router();

const LookingForController = require('../controllers/lookingFor.controller');

/**
 * @swagger
 * /api/master/looking-for:
 *   get:
 *     summary: Get looking for
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
router.get('/looking-for', LookingForController.getLookingFor);

module.exports = router;