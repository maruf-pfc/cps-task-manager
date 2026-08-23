import express from 'express';
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/taskController.js';

import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  addCommentSchema,
  updateCommentSchema,
} from '../validations/taskValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and comment tracking
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter tasks by type (e.g. general)
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
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
 *               - assignedTo
 *               - reportedTo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, BLOCKED]
 *               priority:
 *                 type: string
 *                 enum: [NORMAL, MEDIUM, HIGH]
 *               assignedTo:
 *                 type: string
 *               reportedTo:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 */
router
  .route('/')
  .post(validate(createTaskSchema), createTask)
  .get(getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
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
 *       404:
 *         description: Task not found
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
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
 *       404:
 *         description: Task not found
 */
router
  .route('/:id')
  .get(getTask)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

/**
 * @swagger
 * /api/v1/tasks/{id}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Comment added
 */
router.route('/:id/comments').post(validate(addCommentSchema), addComment);

/**
 * @swagger
 * /api/v1/tasks/{id}/comments/{commentId}:
 *   put:
 *     summary: Update a task comment
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *   delete:
 *     summary: Delete a task comment
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router
  .route('/:id/comments/:commentId')
  .put(validate(updateCommentSchema), updateComment)
  .delete(deleteComment);

export default router;
