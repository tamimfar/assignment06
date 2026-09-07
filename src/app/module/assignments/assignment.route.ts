import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import  validateRequest  from "../../middleware/validatiReqest";
import { UserRole } from "../../../generated/prisma/enums";

import { assignmentController } from "./assignment.controller";

import {
    createAssignmentValidation,
    updateAssignmentValidation,
} from "./assignment.validation";


const router = Router();


// =====================================================
// CREATE
// ADMIN ONLY
// =====================================================


/**

 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment
 *     description: Assign a technician to a complaint. ADMIN only.
 *     tags:
 *       - Assignment
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
 *               - technicianId
 *             properties:
 *               complaintId:
 *                 type: string
 *                 format: uuid
 *                 description: Complaint ID to assign
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               technicianId:
 *                 type: string
 *                 format: uuid
 *                 description: Technician user ID
 *                 example: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Bad request or invalid complaint/technician
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden. ADMIN only.
 *       404:
 *         description: Complaint or technician not found
 *       409:
 *         description: Complaint is already assigned
 *       500:
 *         description: Internal server error
 */


router.post(
    "/",

    auth(UserRole.ADMIN),

    validateRequest(
        createAssignmentValidation
    ),

    assignmentController.createAssignment
);


// =====================================================
// GET ALL
// ADMIN + TECHNICIAN
// =====================================================
/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments
 *     description: Get all assignments. ADMIN, TECHNICIAN, USER.
 *     tags:
 *       - Assignment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
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
        UserRole.ADMIN,
        UserRole.TECHNICIAN,
        UserRole.USER
    ),

    assignmentController.getAssignments
);


// =====================================================
// GET BY ID
// ADMIN + TECHNICIAN
// =====================================================

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     description: Get assignment by ID. ADMIN, TECHNICIAN.
 *     tags:
 *       - Assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id",

    auth(
        UserRole.ADMIN,
        UserRole.TECHNICIAN
    ),

    assignmentController.getAssignmentById
);


// =====================================================
// UPDATE
// ADMIN + TECHNICIAN
// =====================================================

/**
 * @swagger
 * /assignments/{id}:
 *   patch:
 *     summary: Update assignment
 *     description: Update assignment. ADMIN, TECHNICIAN.
 *     tags:
 *       - Assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: string
 *               technicianId:
 *                 type: string
 *             example:
 *               complaintId: 1
 *               technicianId: 1
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:id",

    auth(
        UserRole.ADMIN,
        UserRole.TECHNICIAN
    ),

    validateRequest(
        updateAssignmentValidation
    ),

    assignmentController.updateAssignment
);


// =====================================================
// DELETE
// ADMIN ONLY
// =====================================================

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete assignment by ID
 *     description: Delete assignment by ID. ADMIN only.
 *     tags:
 *       - Assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",

    auth(UserRole.ADMIN),

    assignmentController.deleteAssignment
);


export const assignmentRouter = router;