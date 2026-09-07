import { Router } from "express";

import { areaController } from "./area.controller";
import { areaValidation } from "./area.validation";

import  validateRequest  from "../../middleware/validatiReqest";
import { auth } from "../../middleware/checkAuth";

import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
        
/**
 * @swagger
 * /areas:
 *   post:
 *     summary: Create a new area
 *     description: Create a new area. ADMIN only.
 *     tags:
 *       - Area
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
 *               - district
 *               - division
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kasba
 *               district:
 *                 type: string
 *                 example: Brahmanbaria
 *               division:
 *                 type: string
 *                 example: Chattogram
 *               description:
 *                 type: string
 *                 example: Kasba residential area
 *     responses:
 *       201:
 *         description: Area created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *//*
|--------------------------------------------------------------------------
| Create Area
|--------------------------------------------------------------------------
| ADMIN only
*/

router.post(
    "/",
    auth(UserRole.ADMIN),
    validateRequest(areaValidation.createAreaValidation),
    areaController.createArea
);


/*
|--------------------------------------------------------------------------
| Get All Areas
|--------------------------------------------------------------------------
| USER, TECHNICIAN, ADMIN
*/

/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Get all areas
 *     description: Get all areas. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Area
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Areas retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.get(
    "/",
    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),
    areaController.getAllAreas
);


/*
|--------------------------------------------------------------------------
| Get Area By ID
|--------------------------------------------------------------------------
| USER, TECHNICIAN, ADMIN
*/

/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Get area by ID
 *     description: Get area by ID. USER, TECHNICIAN, ADMIN.
 *     tags:
 *       - Area
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Area not found
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
    areaController.getAreaById
);


/*
|--------------------------------------------------------------------------
| Update Area
|--------------------------------------------------------------------------
| ADMIN only
*/
/**
 * @swagger
 * /areas/{id}:
 *   patch:
 *     summary: Update area by ID
 *     description: Update area by ID. ADMIN only.
 *     tags:
 *       - Area
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kasba
 *               district:
 *                 type: string
 *                 example: Brahmanbaria
 *               division:
 *                 type: string
 *                 example: Chattogram
 *               description:
 *                 type: string
 *                 example: Kasba residential area
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Area updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden   
 */
router.patch(
    "/:id",
    auth(UserRole.ADMIN),
    validateRequest(areaValidation.updateAreaValidation),
    areaController.updateArea
);


/*
|--------------------------------------------------------------------------
| Delete Area
|--------------------------------------------------------------------------
| ADMIN only
*/
/**
 * @swagger
 * /areas/{id}:
 *   delete:
 *     summary: Delete area by ID
 *     description: Delete area by ID. ADMIN only.
 *     tags:
 *       - Area
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area deleted successfully
*/
router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    areaController.deleteArea
);


export const areaRouter = router;