import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserById,
  updateUserProfile,
  createUser,
  changePassword,
  adminUpdateUser,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import {
  canViewUser,
  canModifyUser,
  requireRole,
} from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
} from '../validations/userValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin and Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router
  .route('/')
  .get(protect, requireRole(['ADMIN', 'MANAGER']), getUsers)
  .post(protect, admin, validate(createUserSchema), createUser);

/**
 * @swagger
 * /api/v1/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User role updated
 */
router.route('/:id/role').put(protect, admin, validate(updateUserRoleSchema), updateUserRole);

/**
 * @swagger
 * /api/v1/users/{id}/password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
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
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put('/:id/password', protect, validate(changePasswordSchema), changePassword);

/**
 * @swagger
 * /api/v1/users/{id}/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
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
 *         description: Profile updated
 */
router.route('/:id/profile').put(protect, canModifyUser, validate(updateUserProfileSchema), updateUserProfile);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
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
 *         description: User details
 *   put:
 *     summary: Admin update user
 *     tags: [Users]
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
 *         description: User updated
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
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
 *         description: User deleted
 */
router
  .route('/:id')
  .get(protect, canViewUser, getUserById)
  .put(protect, admin, validate(adminUpdateUserSchema), adminUpdateUser)
  .delete(protect, admin, deleteUser);

export default router;
