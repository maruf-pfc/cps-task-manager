import express from 'express';
import {
  getContestVideoSolutions,
  getContestVideoSolutionById,
  createContestVideoSolution,
  updateContestVideoSolution,
  deleteContestVideoSolution,
} from '../controllers/contestVideoSolutionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createContestVideoSolutionSchema,
  updateContestVideoSolutionSchema,
} from '../validations/contestValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: ContestVideoSolutions
 *   description: Video solutions for programming contest problems
 */

/**
 * @swagger
 * /api/v1/contest-video-solutions:
 *   get:
 *     summary: Get all contest video solution tasks
 *     tags: [ContestVideoSolutions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of video solutions
 *   post:
 *     summary: Create a new video solution task
 *     tags: [ContestVideoSolutions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task created
 */
router
  .route('/')
  .get(getContestVideoSolutions)
  .post(validate(createContestVideoSolutionSchema), createContestVideoSolution);

/**
 * @swagger
 * /api/v1/contest-video-solutions/{id}:
 *   get:
 *     summary: Get video solution by ID
 *     tags: [ContestVideoSolutions]
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
 *         description: Solution details
 *   put:
 *     summary: Update video solution task
 *     tags: [ContestVideoSolutions]
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
 *     summary: Delete video solution task
 *     tags: [ContestVideoSolutions]
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
  .get(getContestVideoSolutionById)
  .put(validate(updateContestVideoSolutionSchema), updateContestVideoSolution)
  .delete(deleteContestVideoSolution);

export default router;
