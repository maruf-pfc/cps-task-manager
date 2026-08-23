import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Dashboard statistics and telemetry
 */

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Get overview dashboard statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregate dashboard stats retrieved successfully
 */
router.route('/').get(protect, getDashboardStats);

export default router;
