const express = require('express');
const router = express.Router();

const ExerciseHabitController = require('../controllers/exerciseHabit.controller');

/**
 * @swagger
 * /api/master/exercise-habit:
 *   get:
 *     summary: Get exercise habits
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
router.get('/exercise-habit', ExerciseHabitController.getExerciseHabits);

module.exports = router;