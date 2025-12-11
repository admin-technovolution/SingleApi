const express = require('express');
const router = express.Router();

const SmokingHabitController = require('../controllers/smokingHabit.controller');

/**
 * @swagger
 * /api/master/smoking-habit:
 *   get:
 *     summary: Get smoking habits
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
router.get('/smoking-habit', SmokingHabitController.getSmokingHabits);

module.exports = router;