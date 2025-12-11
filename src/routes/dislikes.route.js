const express = require('express');
const router = express.Router();
const { dislikesSchema } = require('../validators/dislikes.validator');
const validateBody = require('../../shared/middlewares/validateBody');
const validateToken = require('../../shared/middlewares/validateToken');
const DislikesController = require('../controllers/dislikes.controller');

/**
 * @swagger
 * /api/actions/dislike:
 *   post:
 *     summary: Send a dislike to another user
 *     tags:
 *       - Likes & Dislikes
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization token
 *         example: Bearer eyJhbGciOi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/DislikesSchema'
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
router.post('/dislike', validateToken, validateBody(dislikesSchema), DislikesController.sendDislike);

module.exports = router;