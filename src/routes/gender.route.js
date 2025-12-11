const express = require('express');
const router = express.Router();

const GenderController = require('../controllers/gender.controller');

/**
 * @swagger
 * /api/master/gender:
 *   get:
 *     summary: Get genders
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
router.get('/gender', GenderController.getGenders);

module.exports = router;