import express from 'express';
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createPaymentSchema, updatePaymentSchema } from '../validations/paymentValidation.js';

const router = express.Router();

router.use(protect, requireRole(['ADMIN', 'MANAGER']));

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management for trainers and staff
 */

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *   post:
 *     summary: Create a payment entry
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainer
 *               - name
 *               - classTitle
 *               - amount
 *     responses:
 *       201:
 *         description: Payment created
 */
router
  .route('/')
  .get(getPayments)
  .post(validate(createPaymentSchema), createPayment);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
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
 *         description: Payment updated
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
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
 *         description: Payment deleted
 */
router
  .route('/:id')
  .put(validate(updatePaymentSchema), updatePayment)
  .delete(deletePayment);

export default router;
