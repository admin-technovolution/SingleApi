const express = require('express');
const router = express.Router();

const DrinkingHabitController = require('../controllers/drinkingHabit.controller');

/**
 * @swagger
 * /api/master/drinking-habit:
 *   get:
 *     summary: Get drinking habits
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
router.get('/drinking-habit', DrinkingHabitController.getDrinkingHabits);

module.exports = router;