import express from 'express';
import * as marketingController from '../controllers/marketingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createMarketingSchema, updateMarketingSchema } from '../validations/marketingValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: EmailMarketing
 *   description: Email marketing tasks management
 */

/**
 * @swagger
 * /api/v1/email-marketing:
 *   get:
 *     summary: Get all marketing tasks
 *     tags: [EmailMarketing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of marketing tasks
 *   post:
 *     summary: Create marketing task
 *     tags: [EmailMarketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Marketing task created
 */
router
  .route('/')
  .get(marketingController.getAllMarketingTasks)
  .post(validate(createMarketingSchema), marketingController.createMarketingTask);

/**
 * @swagger
 * /api/v1/email-marketing/{id}:
 *   get:
 *     summary: Get marketing task by ID
 *     tags: [EmailMarketing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *   put:
 *     summary: Update marketing task
 *     tags: [EmailMarketing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated
 *   delete:
 *     summary: Delete marketing task
 *     tags: [EmailMarketing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router
  .route('/:id')
  .get(marketingController.getMarketingTaskById)
  .put(validate(updateMarketingSchema), marketingController.updateMarketingTask)
  .delete(marketingController.deleteMarketingTask);

export default router;
