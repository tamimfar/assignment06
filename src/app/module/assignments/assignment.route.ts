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

router.post(
    "/",

    auth(UserRole.USER),

    validateRequest(
        createAssignmentValidation
    ),

    assignmentController.createAssignment
);


// =====================================================
// GET ALL
// ADMIN + TECHNICIAN
// =====================================================

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

router.delete(
    "/:id",

    auth(UserRole.ADMIN),

    assignmentController.deleteAssignment
);


export const assignmentRouter = router;