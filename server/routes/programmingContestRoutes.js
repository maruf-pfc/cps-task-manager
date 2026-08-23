import express from 'express';
import {
  getContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
} from '../controllers/contestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createContestSchema, updateContestSchema } from '../validations/contestValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: ProgrammingContests
 *   description: Programming contest task management
 */

/**
 * @swagger
 * /api/v1/programming-contests:
 *   get:
 *     summary: Get all programming contests
 *     tags: [ProgrammingContests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contests
 *   post:
 *     summary: Create a programming contest task
 *     tags: [ProgrammingContests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Contest created
 */
router
  .route('/')
  .get(getContests)
  .post(validate(createContestSchema), createContest);

/**
 * @swagger
 * /api/v1/programming-contests/{id}:
 *   get:
 *     summary: Get contest by ID
 *     tags: [ProgrammingContests]
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
 *         description: Contest details
 *   put:
 *     summary: Update contest
 *     tags: [ProgrammingContests]
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
 *         description: Contest updated
 *   delete:
 *     summary: Delete contest
 *     tags: [ProgrammingContests]
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
 *         description: Contest deleted
 */
router
  .route('/:id')
  .get(getContestById)
  .put(validate(updateContestSchema), updateContest)
  .delete(deleteContest);

export default router;
