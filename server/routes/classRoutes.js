import express from 'express';
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createClassSchema, updateClassSchema } from '../validations/classValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class schedule and management
 */

/**
 * @swagger
 * /api/v1/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - batchNo
 *               - classNo
 *               - classTitle
 *               - assignedTo
 *               - reportedTo
 *     responses:
 *       201:
 *         description: Class created
 */
router
  .route('/')
  .get(getClasses)
  .post(validate(createClassSchema), createClass);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
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
 *         description: Class details
 *   put:
 *     summary: Update class
 *     tags: [Classes]
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
 *         description: Class updated
 *   delete:
 *     summary: Delete class
 *     tags: [Classes]
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
 *         description: Class deleted
 */
router
  .route('/:id')
  .get(getClass)
  .put(validate(updateClassSchema), updateClass)
  .delete(deleteClass);

export default router;
