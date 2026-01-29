const express = require('express');
const router = express.Router();

const ReportReasonController = require('../controllers/reportReason.controller');

/**
 * @swagger
 * /api/master/report-reason:
 *   get:
 *     summary: Get report reasons
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
router.get('/report-reason', ReportReasonController.getReportReasons);

module.exports = router;