import { Router } from "express";

import { auth } from "../../middleware/checkAuth";

import validateRequest from "../../middleware/validatiReqest";

import { UserRole } from "../../../generated/prisma/enums";

import {
    updateUserRoleValidation,
    updateUserStatusValidation,
} from "./admin.validation";

import {
    adminController,
} from "./admin.controller";

const router = Router();

// =====================================================
// ADMIN DASHBOARD
// =====================================================
/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     description: Get admin dashboard. ADMIN.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/dashboard",
    auth(UserRole.ADMIN),
    adminController.getDashboard
);

// =====================================================
// GET ALL USERS
// =====================================================
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Get all users. ADMIN.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/users",
    auth(UserRole.ADMIN),
    adminController.getAllUsers
);

// =====================================================
// GET ALL TECHNICIANS
// =====================================================
/**
 * @swagger
 * /admin/technicians:
 *   get:
 *     summary: Get all technicians
 *     description: Get all technicians. ADMIN.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technicians retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/technicians",
    auth(UserRole.ADMIN),
    adminController.getAllTechnicians
);

// =====================================================
// GET SINGLE USER
// =====================================================
router.get(
    "/users/:id",
    auth(UserRole.ADMIN),
    adminController.getUserById
);

// =====================================================
// UPDATE USER STATUS
// =====================================================
/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     description: Update user status. ADMIN.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 */
router.patch(
    "/users/:id/status",
    auth(UserRole.ADMIN),
    validateRequest(
        updateUserStatusValidation
    ),
    adminController.updateUserStatus
);

// =====================================================
// UPDATE USER ROLE
// =====================================================
/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Update user role. ADMIN.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, TECHNICIAN, ADMIN]
 *                 example: USER
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/users/:id/role",
    auth(UserRole.ADMIN),
    validateRequest(
        updateUserRoleValidation
    ),
    adminController.updateUserRole
);

// =====================================================
// DELETE USER
// =====================================================
/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete user by ID. ADMIN only.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
    "/users/:id",
    auth(UserRole.ADMIN),
    adminController.deleteUser
);

export const adminRouter = router;