const express = require('express');
const router = express.Router();
const { likesSchema } = require('../validators/likes.validator');
const validateBody = require('../../shared/middlewares/validateBody');
const validateToken = require('../../shared/middlewares/validateToken');
const LikesController = require('../controllers/likes.controller');

/**
 * @swagger
 * /api/actions/like:
 *   post:
 *     summary: Send a like to another user
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
 *               - $ref: '#/components/schemas/LikesSchema'
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
router.post('/like', validateToken, validateBody(likesSchema), LikesController.sendLike);

/**
 * @swagger
 * /api/actions/likes/received:
 *   get:
 *     summary: Get likes received
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
 *       - in: query
 *         name: cursor
 *         required: false
 *         example: 60d21b4667d0d8992e610c85
 *         schema:
 *           type: string
 *         description: Cursor for pagination
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
router.get('/likes/received', validateToken, LikesController.likesReceived);

module.exports = router;