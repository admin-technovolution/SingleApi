const express = require('express');
const router = express.Router();

const MusicGenresController = require('../controllers/musicGenres.controller');

/**
 * @swagger
 * /api/master/music-genres:
 *   get:
 *     summary: Get music genres
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
router.get('/music-genres', MusicGenresController.getMusicGenres);

module.exports = router;