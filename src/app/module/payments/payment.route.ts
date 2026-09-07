import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import  validateRequest  from "../../middleware/validatiReqest";
import { UserRole } from "../../../generated/prisma/enums";

import {
    createPaymentValidation,
    executePaymentValidation,
} from "./payment.validation";

import {
    paymentController,
} from "./payment.controller";


const router = Router();


// =====================================================
// CREATE BKASH PAYMENT
// USER
// =====================================================

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Create a new payment
 *     description: Create a bKash payment for a resolved complaint. USER only.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complaintId
 *             properties:
 *               complaintId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the resolved complaint for which payment will be created
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Complaint is not resolved or invalid payment request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Complaint not found
 *       409:
 *         description: Payment already exists or is already being processed
 *       500:
 *         description: Internal server error
 */


router.post(
    "/create",

    auth(UserRole.USER),

    validateRequest(
        createPaymentValidation
    ),

    paymentController.createBkashPayment
);


// =====================================================
// EXECUTE BKASH PAYMENT
// USER
// =====================================================

/**
 * @swagger
 * /payments/execute:
 *   post:
 *     summary: Execute a bKash payment
 *     description: Execute a pending bKash payment using the payment ID. USER only.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: bKash payment ID received from the create payment response
 *                 example: TR00110WTl00V1788683416780
 *     responses:
 *       200:
 *         description: Payment executed successfully
 *       400:
 *         description: Invalid payment ID or payment execution failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden. USER only.
 *       404:
 *         description: Payment not found
 *       409:
 *         description: Payment has already been completed
 *       500:
 *         description: Internal server error
 */


router.post(
    "/execute",

    auth(UserRole.USER),

    validateRequest(
        executePaymentValidation
    ),

    paymentController.executeBkashPayment
);


// =====================================================
// MY PAYMENTS
// =====================================================

/**
 * @swagger
 * /payments/my:
 *   get:
 *     summary: Get my payments
 *     description: Get my payments. USER only.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/my",

    auth(UserRole.USER),

    paymentController.getMyPayments
);


// =====================================================
// ADMIN → ALL PAYMENTS
// =====================================================

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     description: Get all payments. ADMIN only.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",

    auth(UserRole.ADMIN),

    paymentController.getAllPayments
);


// =====================================================
// SINGLE PAYMENT
// =====================================================

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     description: Get a payment by ID. USER, ADMIN.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       401:
 */
router.get(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),

    paymentController.getPaymentById
);


export const paymentRouter = router;