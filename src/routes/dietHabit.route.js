const express = require('express');
const router = express.Router();

const DietHabitController = require('../controllers/dietHabit.controller');

/**
 * @swagger
 * /api/master/diet-habit:
 *   get:
 *     summary: Get diet habits
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
router.get('/diet-habit', DietHabitController.getDietHabits);

module.exports = router;