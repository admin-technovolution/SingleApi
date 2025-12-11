const express = require('express');
const router = express.Router();

const ArtistController = require('../controllers/artist.controller');

/**
 * @swagger
 * /api/master/artist:
 *   get:
 *     summary: Get artists
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
router.get('/artist', ArtistController.getArtists);

module.exports = router;