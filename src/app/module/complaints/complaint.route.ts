import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import  validateRequest from "../../middleware/validatiReqest";
import { UserRole } from "../../../generated/prisma/enums";

import { complaintController } from "./complaint.controller";

import {
    createComplaintValidation,
    updateComplaintValidation,
} from "./complaint.validation";


const router = Router();


// ==========================================
// Create Complaint
// USER only
// ==========================================

/**
 * @swagger
 * /complaints:
 *   post:
 *     summary: Create a new complaint
 *     description: Create a new electricity complaint. USER only.
 *     tags:
 *       - Complaint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - areaId
 *               - title
 *               - description
 *               - address
 *             properties:
 *               areaId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               title:
 *                 type: string
 *                 example: Power outage
 *               description:
 *                 type: string
 *                 example: There has been no electricity in my area since morning.
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 default: MEDIUM
 *                 example: HIGH
 *               address:
 *                 type: string
 *                 example: Kasba, Brahmanbaria
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Area not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",

    auth(UserRole.USER),

    validateRequest(createComplaintValidation),

    complaintController.createComplaint
);


// ==========================================
// Get All Complaints
// USER → own
// TECHNICIAN → assigned
// ADMIN → all
// ==========================================

/**
 * @swagger
 * /complaints:
 *   get:
 *     summary: Get all complaints
 *     description: Get all complaints. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Complaint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaints retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",

    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),

    complaintController.getComplaints
);


// ==========================================
// Get Single Complaint
// ==========================================

/**
 * @swagger
 * /complaints/{id}:
 *   get:
 *     summary: Get complaint by ID
 *     description: Get complaint by ID. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Complaint
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),

    complaintController.getComplaintById
);


// ==========================================
// Update Complaint
// USER / TECHNICIAN / ADMIN
// ==========================================

/**
 * @swagger
 * /complaints/{id}:
 *   patch:
 *     summary: Update complaint
 *     description: Update a complaint. USER, TECHNICIAN, or ADMIN based on their permissions.
 *     tags:
 *       - Complaint
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               areaId:
 *                 type: string
 *                 format: uuid
 *                 description: Area ID
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               title:
 *                 type: string
 *                 description: Complaint title
 *                 example: Power outage in my area
 *               description:
 *                 type: string
 *                 description: Complaint description
 *                 example: Electricity has been unavailable since morning.
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: HIGH
 *               address:
 *                 type: string
 *                 description: Complaint address
 *                 example: Kasba, Brahmanbaria
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - ASSIGNED
 *                   - IN_PROGRESS
 *                   - RESOLVED
 *                   - CLOSED
 *                   - CANCELLED
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Complaint updated successfully
 *       400:
 *         description: Validation error or invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),

    validateRequest(updateComplaintValidation),

    complaintController.updateComplaint
);


// ==========================================
// Delete Complaint
// USER / ADMIN
// ==========================================

/**
 * @swagger
 * /complaints/{id}:
 *   delete:
 *     summary: Delete complaint by ID
 *     description: Delete complaint by ID. USER, ADMIN.
 *     tags:
 *       - Complaint
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),

    complaintController.deleteComplaint
);


export const complaintRouter = router;