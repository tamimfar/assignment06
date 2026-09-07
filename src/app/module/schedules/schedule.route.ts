import { Router } from "express";

import { scheduleController } from "./schedule.controller";
import { scheduleValidation } from "./schedule.validation";

import  validateRequest  from "../../middleware/validatiReqest";
import { auth } from "../../middleware/checkAuth";

import { UserRole } from "../../../generated/prisma/enums";


const router = Router();


// ------------------------------------------------------------
// Create Schedule
// ADMIN only
// ------------------------------------------------------------
/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     description: Create a new schedule. ADMIN only.
 *     tags:
 *       - Schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *               - areaId
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               areaId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 */
router.post(
    "/",
    auth(UserRole.ADMIN),
    validateRequest(
        scheduleValidation.createScheduleValidation
    ),
    scheduleController.createSchedule
);


// ------------------------------------------------------------
// Get All Schedules
// USER, TECHNICIAN, ADMIN
// ------------------------------------------------------------
/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules
 *     description: Get all schedules. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
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
    scheduleController.getAllSchedules
);


// ------------------------------------------------------------
// Get Schedule By ID
// USER, TECHNICIAN, ADMIN
// ------------------------------------------------------------

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Get schedule by ID. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
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
    scheduleController.getScheduleById
);


// ------------------------------------------------------------
// Update Schedule
// ADMIN only
// ------------------------------------------------------------
/**
 * @swagger
 * /schedules/{id}:
 *   patch:
 *     summary: Update schedule
 *     description: Update schedule. ADMIN only.
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               areaId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Bad request
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:id",
    auth(UserRole.ADMIN),
    validateRequest(
        scheduleValidation.updateScheduleValidation
    ),
    scheduleController.updateSchedule
);


// ------------------------------------------------------------
// Delete Schedule
// ADMIN only
// ------------------------------------------------------------

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete schedule by ID
 *     description: Delete schedule by ID. ADMIN only.
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    scheduleController.deleteSchedule
);


export const scheduleRouter = router;