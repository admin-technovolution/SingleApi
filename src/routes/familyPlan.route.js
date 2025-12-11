const express = require('express');
const router = express.Router();

const FamilyPlanController = require('../controllers/familyPlan.controller');

/**
 * @swagger
 * /api/master/family-plan:
 *   get:
 *     summary: Get family plans
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
router.get('/family-plan', FamilyPlanController.getFamilyPlans);

module.exports = router;