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

router.delete(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),

    complaintController.deleteComplaint
);


export const complaintRouter = router;