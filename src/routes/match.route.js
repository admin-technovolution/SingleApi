const express = require('express');
const router = express.Router();
const validateToken = require('../../shared/middlewares/validateToken');
const MatchController = require('../controllers/match.controller');

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Get user matches
 *     tags:
 *       - Matches
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.get('/matches', validateToken, MatchController.getMatches);

/**
 * @swagger
 * /api/matches/unmatched/{matchId}:
 *   delete:
 *     summary: This action will delete the chat and the match, but the user could see the other in the discover section after unmatching.
 *     tags:
 *       - Matches
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
 *       - in: path
 *         name: matchId
 *         required: true
 *         example: 079d4159d15644e8b0104886
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
router.delete('/matches/unmatched/:matchId', validateToken, MatchController.unmatched);

/**
 * @swagger
 * /api/matches/blocked/{matchId}:
 *   delete:
 *     summary: This action will delete the chat and the match, but the user could not see again the other in the discover section after blocking.
 *     tags:
 *       - Matches
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
 *       - in: path
 *         name: matchId
 *         required: true
 *         example: 079d4159d15644e8b0104886
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
router.delete('/matches/blocked/:matchId', validateToken, MatchController.blocked);

module.exports = router;